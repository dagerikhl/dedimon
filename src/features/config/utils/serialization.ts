import { IApiServerConfig } from "@/features/config/types/IApiServerConfig";

export const parseConfig = <T extends Record<string, any>>(
  configStr: string,
): IApiServerConfig<T> => JSON.parse(configStr);

export const stringifyConfig = <T extends Record<string, any>>(
  config: IApiServerConfig<T>,
): string => JSON.stringify(config, null, "\t");
