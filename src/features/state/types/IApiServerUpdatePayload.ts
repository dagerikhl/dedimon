export interface IApiServerUpdatePayloadStart {
  action: "start";
}
export interface IApiServerUpdatePayloadStop {
  action: "stop";
}
export interface IApiServerUpdatePayloadUpdate {
  action: "update";
  validate: boolean;
}

export type IApiServerUpdatePayload =
  | IApiServerUpdatePayloadStart
  | IApiServerUpdatePayloadStop
  | IApiServerUpdatePayloadUpdate;
