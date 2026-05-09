import type { IApiServerState } from "@/features/state/types/IApiServerState";
import type { IApiServerStateInfo } from "@/features/state/types/IApiServerStateInfo";
import type { IServerStatus } from "@/modules/server-status/types/IServerStatus";

export type IApiServerEvent<
  Info extends Record<string, any> = Record<string, any>,
> =
  | { kind: "snapshot"; state: IApiServerState<Info> }
  | {
      kind: "state-patch";
      patch: {
        status?: IServerStatus;
        started?: string | null;
        info?: Partial<IApiServerStateInfo<Info>>;
      };
    }
  | { kind: "log-append"; entries: string[] };
