import { ADAPTERS } from "@/features/adapters/ADAPTERS";
import { IApiServerConfig } from "@/features/config/types/IApiServerConfig";

const ADAPTER = ADAPTERS[process.env.NEXT_PUBLIC_ADAPTER];

export const parseConfig = <T extends Record<string, any>>(
  configStr: string,
): IApiServerConfig<T> => JSON.parse(configStr);

export const stringifyConfig = <T extends Record<string, any>>(
  config: IApiServerConfig<T>,
): string =>
  `${JSON.stringify(config, null, ADAPTER.configSpec.indent)}${ADAPTER.configSpec.newlineEof ? "\n" : ""}`;
