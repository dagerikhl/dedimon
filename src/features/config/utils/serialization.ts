import { IAdapterConfigSpec } from "@/features/adapters/types/IAdapterConfigSpec";

export const parseConfig = <T>(
  configStr: string,
  configSpec: IAdapterConfigSpec,
): T => {
  if (configSpec.type === "json") {
    return JSON.parse(configStr);
  }

  throw new Error(`Config spec "${configSpec.type}" not supported`);
};

export const stringifyConfig = <T>(
  config: T,
  configSpec: IAdapterConfigSpec,
): string => {
  if (configSpec.type === "json") {
    return `${JSON.stringify(config, null, configSpec.indent).replace(/(\r)?\n/g, configSpec.newline)}${configSpec.newlineEof ? configSpec.newline : ""}`;
  }

  throw new Error(`Config spec "${configSpec.type}" not supported`);
};

export const normalizeConfig = (configStr: string): string =>
  configStr.replace(/[\u200B-\u200D\uFEFF]/g, "");
