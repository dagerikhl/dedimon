import { IAdapterConfigSpec } from "@/features/adapters/types/IAdapterConfigSpec";
import { IAdapterStateInfoSpec } from "@/features/adapters/types/IAdapterStateInfoSpec";
import { IAdapterType } from "@/features/adapters/types/IAdapterType";

export interface IAdapterSpec<
  A extends IAdapterType,
  Info extends Record<string, any>,
> {
  id: A;
  configSpec: IAdapterConfigSpec;
  stateInfoSpec: IAdapterStateInfoSpec<Info>;
}
