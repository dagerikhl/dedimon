import { IApiServerConfig } from "@/features/config/types/IApiServerConfig";
import {
  parseConfig,
  stringifyConfig,
} from "@/features/config/utils/serialization";
import fs from "fs/promises";
import path from "path";

type INoAdapterConfig = Record<string, any>;

export const GET = async () => {
  if (!process.env.SERVER_CONFIG_PATH) {
    throw new Error(
      "SERVER_CONFIG_PATH environment variable missing, unable to get config",
    );
  }

  const config = await fs.readFile(
    path.resolve(process.env.SERVER_CONFIG_PATH),
    "utf-8",
  );

  return Response.json(parseConfig(config));
};

export const POST = async (req: Request) => {
  if (!process.env.SERVER_CONFIG_PATH) {
    throw new Error(
      "SERVER_CONFIG_PATH environment variable missing, unable to update config",
    );
  }

  const body = (await req.json()) as IApiServerConfig<INoAdapterConfig>;

  await fs.writeFile(
    path.resolve(process.env.SERVER_CONFIG_PATH),
    stringifyConfig(body),
  );

  return new Response();
};
