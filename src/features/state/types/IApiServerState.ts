import { IApiServerStateInfo } from "@/features/state/types/IApiServerStateInfo";
import { IServerStatus } from "@/modules/server-status/types/IServerStatus";

export interface IApiServerState<
  Info extends Record<string, any> = Record<string, any>,
> {
  status: IServerStatus;
  started?: string;
  log?: string[];
  info?: IApiServerStateInfo<Info>;
}
