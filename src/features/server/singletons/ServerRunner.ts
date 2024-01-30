import { IApiServerState } from "@/features/state/types/IApiServerState";
import { ChildProcess, execFile } from "child_process";
import path from "path";

const SERVER_START_RE = /\[Session\] 'HostOnline' \(up\)!/;

export class ServerRunner {
  private static _instance: ServerRunner;

  private _steamCmdPath: string;
  private _serverPath: string;
  private _serverExeFilename: string;
  private _serverConfigFilename: string;

  private _serverProcess: ChildProcess | undefined;
  private _state: IApiServerState = { status: "stopped" };

  private constructor(
    steamCmdPath: string,
    serverPath: string,
    serverExeFilename: string,
    serverConfigFilename: string,
  ) {
    this._steamCmdPath = steamCmdPath;
    this._serverPath = serverPath;
    this._serverExeFilename = serverExeFilename;
    this._serverConfigFilename = serverConfigFilename;
  }

  static getInstance(): ServerRunner {
    if (
      !process.env.STEAMCMD_PATH ||
      !process.env.SERVER_PATH ||
      !process.env.SERVER_EXE_FILENAME ||
      !process.env.SERVER_CONFIG_FILENAME
    ) {
      throw new Error(
        "Unable to find all the required environment variables [STEAMCMD_PATH, SERVER_PATH, SERVER_EXE_FILENAME, SERVER_CONFIG_FILENAME], please make sure they are present in the `.env.local` file at the project root",
      );
    }

    if (!ServerRunner._instance) {
      ServerRunner._instance = new ServerRunner(
        process.env.STEAMCMD_PATH,
        process.env.SERVER_PATH,
        process.env.SERVER_EXE_FILENAME,
        process.env.SERVER_CONFIG_FILENAME,
      );
    }

    return ServerRunner._instance;
  }

  public getState(): IApiServerState {
    return this._state;
  }

  public start() {
    if (this._serverProcess) {
      console.error(
        "Server already started, please stop server before starting it",
      );

      return;
    }

    this._state = { status: "starting" };

    this._serverProcess = execFile(
      path.resolve(this._serverPath, this._serverExeFilename),
    );

    this._serverProcess.stdout?.on("data", (data) => {
      process.stdout.write(data);

      if (SERVER_START_RE.test(data)) {
        this._state = { status: "running", started: new Date().toISOString() };
      }
    });
  }

  public stop() {
    if (!this._serverProcess) {
      console.error(
        "Server not currently started, please start the server before stopping it",
      );

      return;
    }

    this._state = { status: "stopping" };

    this._serverProcess.on("close", (code, signal) => {
      console.log(`Server stopped with code ${code} from signal ${signal}`);
    });

    // TODO This might not actually kill the process
    this._serverProcess.kill();

    // TODO Actually read output from EXE to see when it's actually started
    setTimeout(() => {
      this._state = { status: "stopped" };

      this._serverProcess = undefined;
    }, 5000);
  }
}
