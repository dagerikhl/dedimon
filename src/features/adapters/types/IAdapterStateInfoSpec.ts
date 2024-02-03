import { IApiServerStateInfo } from "@/features/state/types/IApiServerStateInfo";

export type IAdapterStateInfoCheckStarted<Info extends Record<string, any>> = (
  data: string,
  current: IApiServerStateInfo<Info> | undefined,
) => boolean;

export type IAdapterStateInfoGetter<Info extends Record<string, any>> = (
  data: string,
  current: IApiServerStateInfo<Info> | undefined,
) => IApiServerStateInfo<Info>;

export interface IAdapterStateInfoSpec<Info extends Record<string, any>> {
  checkStarted: IAdapterStateInfoCheckStarted<Info>;
  infoGetters: IAdapterStateInfoGetter<Info>[];
}
