import { ADAPTERS } from "@/features/adapters/ADAPTERS";
import { IAdapterType } from "@/features/adapters/types/IAdapterType";
import { getTimestamp, LOGGER } from "@/features/server/utils/logger";
import { IApiServerState } from "@/features/state/types/IApiServerState";
import { IApiServerStateInfo } from "@/features/state/types/IApiServerStateInfo";
import { existsSync } from "node:fs";
import * as pty from "node-pty";
import path from "path";
import { IProgress, SteamCmd } from "steamcmd-interface";
import { Tail } from "tail";

type ISetter<S> = S | ((prevState: S) => S);

type ISubscribeCallback = (state: IApiServerState) => void;
type IUnsubscribeCallback = () => void;

type ILogLineTransformer = (data: string) => string;

const mergeLog = (log: string[] | undefined, newLogEntry: string): string[] => [
  ...(log ?? []),
  newLogEntry,
];

const mergeInfo = <Info extends Record<string, any>>(
  info: IApiServerStateInfo<Info> | undefined,
  newInfo: IApiServerStateInfo<Info>,
): IApiServerStateInfo<Info> | undefined => {
  const mergedInfo: IApiServerStateInfo<Info> = {
    ...info,
  } as IApiServerStateInfo<Info>;

  for (const [key, value] of Object.entries(newInfo)) {
    if (value === null || value === undefined) {
      continue;
    }

    mergedInfo[key as keyof IApiServerStateInfo<Info>] = value;
  }

  if (
    Object.values(mergedInfo).filter((x) => x !== null && x !== undefined)
      .length === 0
  ) {
    return undefined;
  }

  return mergedInfo;
};

const normalizeLogLine = (line: string): string =>
  line
    .replace(/(^\r?\n|\r?\n$)/g, "")
    .replace(/[\x1B\x07](\[[^\\;\]]{1,4})?/g, "")
    .replaceAll("m]0;", "");

const formatSteamCmdProgress = (progress: IProgress): string =>
  `${progress.state} [${progress.stateCode}]: ${progress.progressPercent} % (${progress.progressAmount} / ${progress.progressTotalAmount})`;

export class ServerRunner {
  private static _instance: ServerRunner;

  private readonly _adapter: IAdapterType;
  private readonly _appId: string;
  private readonly _serverPath: string;
  private readonly _serverExePath: string;
  private readonly _serverExeArgs: string[] | undefined;
  private readonly _serverLogPath: string | undefined;

  private _serverProcess: pty.IPty | undefined;
  private _logTailProcess: Tail | undefined;

  private readonly _subscribers: Map<number, ISubscribeCallback>;

  private _state: IApiServerState = { status: "stopped" };

  private constructor(
    adapter: IAdapterType,
    appId: string,
    serverPath: string,
    serverExePath: string,
    serverExeArgs: string | undefined,
    serverLogPath: string | undefined,
  ) {
    this._adapter = adapter;
    this._appId = appId;
    this._serverPath = path.resolve(serverPath);
    this._serverExePath = path.resolve(serverExePath);
    this._serverExeArgs = serverExeArgs ? serverExeArgs.split(",") : undefined;
    this._serverLogPath = serverLogPath;

    this._subscribers = new Map();
  }

  public static getInstance(): ServerRunner {
    if (!process.env.NEXT_PUBLIC_ADAPTER) {
      throw new Error(
        "The NEXT_PUBLIC_ADAPTER environment variable is missing, please make sure it's present in the `.env.local` file at the project root",
      );
    }
    if (
      !process.env.APP_ID ||
      !process.env.SERVER_PATH ||
      !process.env.SERVER_EXE_PATH ||
      !process.env.SERVER_CONFIG_PATHS
    ) {
      throw new Error(
        "Unable to find all the required environment variables [APP_ID, SERVER_PATH, SERVER_EXE_PATH, SERVER_CONFIG_PATHS], please make sure they are present in the `.env.local` file at the project root",
      );
    }

    if (!ServerRunner._instance) {
      ServerRunner._instance = new ServerRunner(
        process.env.NEXT_PUBLIC_ADAPTER,
        process.env.APP_ID,
        process.env.SERVER_PATH,
        process.env.SERVER_EXE_PATH,
        process.env.SERVER_EXE_ARGS,
        process.env.SERVER_LOG_PATH,
      );
    }

    return ServerRunner._instance;
  }

  private createDeathHandler =
    (resolve: VoidFunction) => (code: number, signal?: number) => {
      this.setState((current) => ({
        status: "stopped",
        log: current.log,
        info: current.info,
      }));

      this._serverProcess = undefined;

      LOGGER.info(`Server stopped with code ${code} from signal ${signal}`);

      resolve();
    };

  private createLogHandler =
    (resolve: VoidFunction, transformer?: ILogLineTransformer) =>
    (data: string) => {
      const normalizedData = normalizeLogLine(data);

      if (!normalizedData) {
        return;
      }

      const transformedData = transformer
        ? transformer(normalizedData)
        : normalizedData;

      const adapterSpec = ADAPTERS[this._adapter];

      let info: Record<string, any> = {};
      for (const infoGetter of adapterSpec.stateInfoSpec.infoGetters) {
        info = {
          ...info,
          ...infoGetter(transformedData, this.getState().info),
        };
      }

      const newLogEntry = `${getTimestamp()} ${transformedData}`;

      if (
        adapterSpec.stateInfoSpec.checkStarted(
          transformedData,
          this.getState().info,
        )
      ) {
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
    return new Promise<void>((resolve, reject) => {
      if (this._serverProcess) {
        LOGGER.error(
          "Server already started, please stop server before starting it",
        );

        resolve();

        return;
      }

      this.setState({ status: "starting" });

      try {
        this._serverProcess = pty.spawn(
          this._serverExePath,
          this._serverExeArgs ?? [],
          {
            cwd: path.dirname(this._serverExePath),
            handleFlowControl: true,
            cols: 500,
          },
        );

        if (this._serverLogPath && existsSync(this._serverLogPath)) {
          this._logTailProcess = new Tail(this._serverLogPath);
          this._logTailProcess.on(
            "line",
            this.createLogHandler(resolve, (data) =>
              data.replace(
                /^\[\d{4}\.\d{2}\.\d{2}-\d{2}\.\d{2}\.\d{2}:\d{3}]/,
                "",
              ),
            ),
          );
        } else {
          this._serverProcess.on("data", this.createLogHandler(resolve));
        }

        this._serverProcess.on("exit", this.createDeathHandler(resolve));
      } catch (e) {
        this.setState({ status: "stopped" });

        reject(e);
      }
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

      this._serverProcess.on("exit", this.createDeathHandler(resolve));

      this._serverProcess.write("\x03");

      if (this._logTailProcess) {
        this._logTailProcess.unwatch();
        this._logTailProcess = undefined;
      }
    });
  };

  public update = async (validate: boolean) => {
    return new Promise<void>(async (resolve, reject) => {
      if (this._serverProcess) {
        LOGGER.info("Server currently running, shutting down for update");

        await this.stop();
      }

      this.setState((current) => ({
        ...current,
        log: mergeLog(
          current.log,
          `${"-".repeat(20)} UPDATING SERVER... ${"-".repeat(20)}`,
        ),
      }));

      try {
        const steamCmd = await SteamCmd.init({
          installDir: this._serverPath,
          enableDebugLogging: true,
        });

        for await (const progress of steamCmd.updateApp(this._appId, {
          validate,
        })) {
          this.setState((current) => ({
            ...current,
            log: mergeLog(current.log, formatSteamCmdProgress(progress)),
          }));
        }

        this.setState((current) => ({
          ...current,
          log: mergeLog(
            current.log,
            `${"-".repeat(20)} UPDATE COMPLETE ${"-".repeat(20)}`,
          ),
        }));

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };
}
