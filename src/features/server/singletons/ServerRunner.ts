import { sleep } from "@/common/utils/async/sleep";
import { formatDatetime } from "@/common/utils/formatting/datetime";
import { getTimestamp, LOGGER } from "@/features/server/utils/logger";
import { IApiServerState } from "@/features/state/types/IApiServerState";
import { IApiServerStateInfo } from "@/features/state/types/IApiServerStateInfo";
import { ChildProcess, execFile } from "child_process";
import path from "path";

type ISetter<S> = S | ((prevState: S) => S);

type ISubscribeCallback = (state: IApiServerState) => void;
type IUnsubscribeCallback = () => void;

const SERVER_START_RE = /\[Session] 'HostOnline' \(up\)!/i;

const INFO_GAME_VERSION_RE = /Game Version \(SVN\): (\d+)/i;
const INFO_BASE_COUNT_RE = /\[savexxx] LOAD (\d+) bases \d+ entities/i;
const INFO_ENTITY_COUNT_RE = /\[savexxx] LOAD \d+ bases (\d+) entities/i;
const INFO_PUBLIC_IP_RE = /\[online] Public ipv4: (\d+\.\d+\.\d+\.\d+)/i;
const INFO_LAST_SAVED_RE = /\[server] Saved/i;

const toNumberIfDefined = (value: string | undefined): number | undefined =>
  value ? +value : undefined;

const mergeLog = (log: string[] | undefined, newLogEntry: string): string[] => [
  ...(log ?? []),
  newLogEntry,
];

const mergeInfo = (
  info: IApiServerStateInfo | undefined,
  newInfo: IApiServerStateInfo,
): IApiServerStateInfo | undefined => {
  const mergedInfo: IApiServerStateInfo = { ...info };

  for (const [key, value] of Object.entries(newInfo)) {
    if (value === null || value === undefined) {
      continue;
    }

    mergedInfo[key as keyof IApiServerStateInfo] = value;
  }

  if (
    Object.values(mergedInfo).filter((x) => x !== null && x !== undefined)
      .length === 0
  ) {
    return undefined;
  }

  return mergedInfo;
};

export class ServerRunner {
  private static _instance: ServerRunner;

  private readonly _appId: string;
  private readonly _steamCmdPath: string;
  private readonly _serverPath: string;
  private readonly _serverExePath: string;
  private readonly _serverConfigPath: string;

  private _serverProcess: ChildProcess | undefined;

  private readonly _subscribers: Map<number, ISubscribeCallback>;

  private _state: IApiServerState = { status: "stopped" };

  private constructor(
    appId: string,
    steamCmdPath: string,
    serverPath: string,
    serverExePath: string,
    serverConfigPath: string,
  ) {
    this._appId = path.resolve(appId);
    this._steamCmdPath = path.resolve(steamCmdPath);
    this._serverPath = path.resolve(serverPath);
    this._serverExePath = path.resolve(serverExePath);
    this._serverConfigPath = path.resolve(serverConfigPath);

    this._subscribers = new Map();
  }

  public static getInstance(): ServerRunner {
    if (
      !process.env.APP_ID ||
      !process.env.STEAMCMD_PATH ||
      !process.env.SERVER_PATH ||
      !process.env.SERVER_EXE_PATH ||
      !process.env.SERVER_CONFIG_PATH
    ) {
      throw new Error(
        "Unable to find all the required environment variables [APP_ID, STEAMCMD_PATH, SERVER_PATH, SERVER_EXE_PATH, SERVER_CONFIG_PATH], please make sure they are present in the `.env.local` file at the project root",
      );
    }

    if (!ServerRunner._instance) {
      ServerRunner._instance = new ServerRunner(
        process.env.APP_ID,
        process.env.STEAMCMD_PATH,
        process.env.SERVER_PATH,
        process.env.SERVER_EXE_PATH,
        process.env.SERVER_CONFIG_PATH,
      );
    }

    return ServerRunner._instance;
  }

  private createDeathHandler =
    (resolve: VoidFunction) =>
    (code: number | null, signal: NodeJS.Signals) => {
      this.setState((current) => ({ status: "stopped", log: current.log }));

      this._serverProcess = undefined;

      LOGGER.info(`Server stopped with code ${code} from signal ${signal}`);

      resolve();
    };

  private createLogHandler = (resolve: VoidFunction) => (data: string) => {
    const info: IApiServerStateInfo = {
      gameVersion: data.match(INFO_GAME_VERSION_RE)?.[1],
      baseCount: toNumberIfDefined(data.match(INFO_BASE_COUNT_RE)?.[1]),
      entityCount: toNumberIfDefined(data.match(INFO_ENTITY_COUNT_RE)?.[1]),
      publicIp: data.match(INFO_PUBLIC_IP_RE)?.[1],
      lastSaved: INFO_LAST_SAVED_RE.test(data)
        ? formatDatetime(new Date(), true)
        : undefined,
    };

    const newLogEntry = `${getTimestamp()} ${data}`;

    if (SERVER_START_RE.test(data)) {
      this.setState((current) => ({
        status: "running",
        started: new Date().toISOString(),
        log: mergeLog(current.log, newLogEntry),
        info: mergeInfo(current.info, info),
      }));

      resolve();
    } else {
      this.setState((current) => ({
        ...current,
        log: mergeLog(current.log, newLogEntry),
        info: mergeInfo(current.info, info),
      }));
    }
  };

  public getState = (): IApiServerState => this._state;

  private setState = (state: ISetter<IApiServerState>) => {
    this._state = typeof state === "function" ? state(this._state) : state;

    this._subscribers.forEach((value) => {
      value(this._state);
    });
  };

  public subscribe = (cb: ISubscribeCallback): IUnsubscribeCallback => {
    const id = this._subscribers.size;

    this._subscribers.set(id, cb);

    cb(this.getState());

    LOGGER.info("Subscription added, now:", this._subscribers.size);

    return () => {
      this._subscribers.delete(id);

      LOGGER.info("Subscription removed, now:", this._subscribers.size);
    };
  };

  public start = async () => {
    return new Promise<void>((resolve) => {
      if (this._serverProcess) {
        LOGGER.error(
          "Server already started, please stop server before starting it",
        );

        resolve();

        return;
      }

      this.setState({ status: "starting" });

      this._serverProcess = execFile(this._serverExePath);

      this._serverProcess.stdout?.on("data", this.createLogHandler(resolve));
    });
  };

  public stop = async () => {
    return new Promise<void>((resolve) => {
      if (!this._serverProcess) {
        LOGGER.error(
          "Server not currently started, please start the server before stopping it",
        );

        resolve();

        return;
      }

      this.setState((current) => ({ ...current, status: "stopping" }));

      this._serverProcess.on("close", this.createDeathHandler(resolve));

      // Note: Signals aren't supported on Windows, so this won't shut down gracefully, it'll kill it immediately
      // TODO Figure out a way to gracefully shut down server
      this._serverProcess.kill("SIGINT");
    });
  };

  public update = async () => {
    return new Promise<void>(async (resolve) => {
      if (this._serverProcess) {
        LOGGER.info("Server current running, shutting down for update");

        await this.stop();

        // Wait to let the server actually shut down
        await sleep(5000);
      }

      this.setState((current) => ({
        ...current,
        log: mergeLog(
          current.log,
          `\n\n${"-".repeat(20)} UPDATING SERVER... ${"-".repeat(20)}\n\n`,
        ),
      }));

      const steamCmdProcess = execFile(this._steamCmdPath, [
        `+force_install_dir ${path.basename(this._serverPath)}`,
        "+login anonymous",
        `+app_update ${this._appId} validate`,
      ]);

      const handleLog = (data: string) => {
        const newLogEntry = `${getTimestamp()} [UPDATE] ${data}`;

        this.setState((current) => ({
          ...current,
          log: mergeLog(current.log, newLogEntry),
        }));
      };

      steamCmdProcess.stdout?.on("data", handleLog);

      const handleDeath = (code: number | null, signal: NodeJS.Signals) => {
        LOGGER.info(`Update stopped with code ${code} from signal ${signal}`);

        this.setState((current) => ({
          ...current,
          log: mergeLog(
            current.log,
            `\n\n${"-".repeat(20)} UPDATE COMPLETE ${"-".repeat(20)}\n\n`,
          ),
        }));

        // TODO This process might not exist, may need to sleep, then kill it
        resolve();
      };

      steamCmdProcess.on("close", handleDeath);
    });
  };
}
