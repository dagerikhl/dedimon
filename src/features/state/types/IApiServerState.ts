import { IApiServerStateInfo } from "@/features/state/types/IApiServerStateInfo";
import { IServerStatus } from "@/modules/server-status/types/IServerStatus";

export interface IApiServerState {
  status: IServerStatus;
  started?: string;
  log?: string[];
  info?: IApiServerStateInfo;
}
