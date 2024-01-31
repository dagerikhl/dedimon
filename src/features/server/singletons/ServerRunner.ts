import { LOGGER } from "@/features/server/utils/logger";
import { IApiServerState } from "@/features/state/types/IApiServerState";
import { ChildProcess, execFile } from "child_process";
import path from "path";

type ISetter<S> = S | ((prevState: S) => S);

type ISubscribeCallback = (state: IApiServerState) => void;
type IUnsubscribeCallback = () => void;

const SERVER_START_RE = /\[Session] 'HostOnline' \(up\)!/;

export class ServerRunner {
  private static _instance: ServerRunner;

  private readonly _steamCmdPath: string;
  private readonly _serverPath: string;
  private readonly _serverExePath: string;
  private readonly _serverConfigPath: string;

  private _serverProcess: ChildProcess | undefined;

  private readonly _subscribers: Map<number, ISubscribeCallback>;

  private _state: IApiServerState = { status: "stopped" };

  private constructor(
    steamCmdPath: string,
    serverPath: string,
    serverExePath: string,
    serverConfigPath: string,
  ) {
    this._steamCmdPath = path.resolve(steamCmdPath);
    this._serverPath = path.resolve(serverPath);
    this._serverExePath = path.resolve(serverExePath);
    this._serverConfigPath = path.resolve(serverConfigPath);

    this._subscribers = new Map();
  }

  public static getInstance(): ServerRunner {
    if (
      !process.env.STEAMCMD_PATH ||
      !process.env.SERVER_PATH ||
      !process.env.SERVER_EXE_PATH ||
      !process.env.SERVER_CONFIG_PATH
    ) {
      throw new Error(
        "Unable to find all the required environment variables [STEAMCMD_PATH, SERVER_PATH, SERVER_EXE_PATH, SERVER_CONFIG_PATH], please make sure they are present in the `.env.local` file at the project root",
      );
    }

    if (!ServerRunner._instance) {
      ServerRunner._instance = new ServerRunner(
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
    if (SERVER_START_RE.test(data)) {
      this.setState((current) => ({
        status: "running",
        started: new Date().toISOString(),
        log: [...(current.log ?? []), data],
      }));

      resolve();
    } else {
      this.setState((current) => ({
        ...current,
        log: [...(current.log ?? []), data],
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
}
