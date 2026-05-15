import { existsSync } from "node:fs";
import path from "node:path";
import * as pty from "node-pty";
import { type IProgress, SteamCmd } from "steamcmd-interface";
import { Tail } from "tail";
import { ADAPTERS } from "@/features/adapters/ADAPTERS";
import type { IAdapterType } from "@/features/adapters/types/IAdapterType";
import { getTimestamp, LOGGER } from "@/features/server/utils/logger";
import type { IApiServerEvent } from "@/features/state/types/IApiServerEvent";
import type { IApiServerState } from "@/features/state/types/IApiServerState";
import type { IApiServerStateInfo } from "@/features/state/types/IApiServerStateInfo";
import { mergeInfo } from "@/features/state/utils/mergeInfo";

type ISubscribeCallback = (event: IApiServerEvent) => void;
type IUnsubscribeCallback = () => void;

type ILogLineTransformer = (data: string) => string;

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
    (resolve: VoidFunction) =>
    ({ exitCode, signal }: { exitCode: number; signal?: number }) => {
      this.emitStatePatch({ status: "stopped", started: null });

      this._serverProcess = undefined;

      LOGGER.info(`Server stopped with code ${exitCode} from signal ${signal}`);

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

      this.emitLogAppend([newLogEntry]);

      const hasInfoChange = Object.keys(info).length > 0;

      if (
        adapterSpec.stateInfoSpec.checkStarted(
          transformedData,
          this.getState().info,
        )
      ) {
        this.emitStatePatch({
          status: "running",
          started: new Date().toISOString(),
          info: hasInfoChange ? info : undefined,
        });

        resolve();
      } else if (hasInfoChange) {
        this.emitStatePatch({ info });
      }
    };

  public getState = (): IApiServerState => this._state;

  private emit = (event: IApiServerEvent) => {
    this._subscribers.forEach((value) => {
      value(event);
    });
  };

  private emitSnapshot = (state: IApiServerState) => {
    this._state = state;

    this.emit({ kind: "snapshot", state });
  };

  private emitStatePatch = (patch: {
    status?: IApiServerState["status"];
    started?: string | null;
    info?: Partial<IApiServerStateInfo<Record<string, any>>>;
  }) => {
    if (patch.status !== undefined) {
      this._state.status = patch.status;
    }
    if (patch.started !== undefined) {
      this._state.started = patch.started ?? undefined;
    }
    if (patch.info !== undefined) {
      this._state.info = mergeInfo(this._state.info, patch.info);
    }

    this.emit({ kind: "state-patch", patch });
  };

  private emitLogAppend = (entries: string[]) => {
    if (!this._state.log) {
      this._state.log = [];
    }
    for (const entry of entries) {
      this._state.log.push(entry);
    }

    this.emit({ kind: "log-append", entries });
  };

  public subscribe = (cb: ISubscribeCallback): IUnsubscribeCallback => {
    const id = this._subscribers.size;

    this._subscribers.set(id, cb);

    cb({ kind: "snapshot", state: this._state });

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

      this.emitSnapshot({ status: "starting", log: [] });

      try {
        LOGGER.info(
          "Starting server:",
          this._serverExePath,
          this._serverExeArgs,
        );

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
          LOGGER.info(
            "Server has SERVER_LOG_PATH configures, will read output from logs instead of terminal. Path:",
            this._serverLogPath,
          );

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
          this._serverProcess.onData(this.createLogHandler(resolve));
        }

        this._serverProcess.onExit(this.createDeathHandler(resolve));
      } catch (e) {
        this.emitSnapshot({ status: "stopped" });

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

      this.emitStatePatch({ status: "stopping" });

      this._serverProcess.onExit(this.createDeathHandler(resolve));

      this._serverProcess.write("\x03");

      setTimeout(() => {
        if (!this._serverProcess) {
          return;
        }

        this._serverProcess.write("\x03");
      }, 5000);

      if (this._logTailProcess) {
        this._logTailProcess.unwatch();
        this._logTailProcess = undefined;
      }
    });
  };

  public update = async (validate: boolean): Promise<void> => {
    if (this._serverProcess) {
      LOGGER.info("Server currently running, shutting down for update");

      await this.stop();
    }

    this.emitLogAppend([
      `${"-".repeat(20)} UPDATING SERVER... ${"-".repeat(20)}`,
    ]);

    try {
      const steamCmd = await SteamCmd.init({
        installDir: this._serverPath,
        enableDebugLogging: true,
      });

      for await (const progress of steamCmd.updateApp(this._appId, {
        validate,
      })) {
        this.emitLogAppend([formatSteamCmdProgress(progress)]);
      }

      this.emitLogAppend([
        `${"-".repeat(20)} UPDATE COMPLETE ${"-".repeat(20)}`,
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      LOGGER.error("Server update failed:", message);
      this.emitLogAppend([
        `${"-".repeat(20)} UPDATE FAILED ${"-".repeat(20)}`,
        message,
      ]);
    }
  };
}
