import { IAdapterConfigSpec } from "@/features/adapters/types/IAdapterConfigSpec";
import { IAdapterStateInfoSpec } from "@/features/adapters/types/IAdapterStateInfoSpec";
import { IAdapterType } from "@/features/adapters/types/IAdapterType";

export interface IAdapterSpec<
  A extends IAdapterType,
  Info extends Record<string, any>,
> {
  id: A;
  name?: string;
  logo?: {
    src: string;
    height: number;
    width: number;
    omitTextFromLogoBanner?: boolean;
    inverted?: boolean;
  };
  configSpecs: Record<string, IAdapterConfigSpec>;
  stateInfoSpec: IAdapterStateInfoSpec<Info>;
}
