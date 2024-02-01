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
    public static async init(config: IInitConfig): Promise<SteamCmd>;

    public async isLoggedIn(): Promise<boolean>;

    public async login(
      username: string,
      password?: string,
      steamGuardCode?: string,
    ): Promise<void>;

    public async run(
      commands: string[],
      options?: { noAutoLogin?: boolean },
    ): AsyncGenerator<void>;

    public async updateApp(
      appId: number | string,
      options?: {
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
