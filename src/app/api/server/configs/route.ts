import { ADAPTERS } from "@/features/adapters/ADAPTERS";
import {
  normalizeConfig,
  parseConfig,
  stringifyConfig,
} from "@/features/config/utils/serialization";
import fs from "fs/promises";
import path from "path";

const ADAPTER = ADAPTERS[process.env.NEXT_PUBLIC_ADAPTER];

export const GET = async () => {
  if (!process.env.SERVER_CONFIG_PATHS) {
    throw new Error(
      "SERVER_CONFIG_PATHS environment variable missing, unable to get configs",
    );
  }

  const configPaths = process.env.SERVER_CONFIG_PATHS.split(",");

  const configs: Record<string, string> = {};
  for (const configPath of configPaths) {
    configs[configPath] = normalizeConfig(
      await fs.readFile(path.resolve(configPath), "utf-8"),
    );
  }

  return Response.json(configs);
};

export const POST = async (req: Request) => {
  if (!process.env.SERVER_CONFIG_PATHS) {
    throw new Error(
      "SERVER_CONFIG_PATHS environment variable missing, unable to update configs",
    );
  }

  const body = (await req.json()) as Record<string, string>;

  for (const [configPath, config] of Object.entries(body)) {
    const configName = path.basename(configPath);
    const configSpec =
      ADAPTER.configSpecs[configName as keyof typeof ADAPTER.configSpecs];

    await fs.writeFile(
      configPath,
      stringifyConfig(
        parseConfig(normalizeConfig(config), configSpec),
        configSpec,
      ),
    );
  }

  return new Response();
};
