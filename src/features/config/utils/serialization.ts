import { IAdapterConfigSpec } from "@/features/adapters/types/IAdapterConfigSpec";

export const parseConfig = <T>(
  configStr: string,
  configSpec: IAdapterConfigSpec,
): T => {
  switch (configSpec.type) {
    case "ini":
      return configStr as T;
    case "json":
      return JSON.parse(configStr);
    case "xml":
      return configStr as T;
  }
};

export const stringifyConfig = <T>(
  config: T,
  configSpec: IAdapterConfigSpec,
): string => {
  let parsedConfig: string;
  switch (configSpec.type) {
    case "ini":
      parsedConfig = config as string;
      break;
    case "json":
      parsedConfig = JSON.stringify(config, null, configSpec.indent);
      break;
    case "xml":
      parsedConfig = config as string;
      break;
  }

  return `${parsedConfig.replace(/(\r)?\n/g, configSpec.newline)}${configSpec.newlineEof ? configSpec.newline : ""}`;
};

export const normalizeConfig = (configStr: string): string =>
  configStr.replace(/[\u200B-\u200D\uFEFF]/g, "");
