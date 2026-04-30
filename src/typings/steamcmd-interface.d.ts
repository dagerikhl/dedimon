declare module "steamcmd-interface" {
  export interface IInitConfig {
    binDir?: string;
    installDir?: string;
    username?: string;
    enableDebugLogging?: boolean;
  }

  export interface IProgress {
    stateCode: string;
    state: string;
    progressPercent: number;
    progressAmount: number;
    progressTotalAmount: number;
  }

  export class SteamCmd {
    public static init(_config: IInitConfig): Promise<SteamCmd>;

    public isLoggedIn(): Promise<boolean>;

    public login(
      _username: string,
      _password?: string,
      _steamGuardCode?: string,
    ): Promise<void>;

    public run(
      _commands: string[],
      _options?: { noAutoLogin?: boolean },
    ): AsyncGenerator<void>;

    public updateApp(
      _appId: number | string,
      _options?: {
        platformType?: string;
        platformBitness?: string;
        validate?: boolean;
        language?: string;
        betaName?: string;
        betaPassword?: string;
      },
    ): AsyncGenerator<IProgress>;
  }
}
