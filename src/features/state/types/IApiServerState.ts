import type { IApiServerStateInfo } from "@/features/state/types/IApiServerStateInfo";
import type { IServerStatus } from "@/modules/server-status/types/IServerStatus";

export interface IApiServerState<
  Info extends Record<string, any> = Record<string, any>,
> {
  status: IServerStatus;
  started?: string;
  log?: string[];
  info?: IApiServerStateInfo<Info>;
}
