import { IServerStatus } from "@/modules/server-status/types/IServerStatus";

export interface IApiServerState {
  status: IServerStatus;
  started?: string;
}
