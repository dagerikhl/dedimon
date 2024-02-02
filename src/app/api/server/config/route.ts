import { ADAPTERS } from "@/features/adapters/ADAPTERS";
import { IEnshroudedServerConfig } from "@/features/adapters/enshrouded/types/IEnshroudedServerConfig";
import { IApiServerConfig } from "@/features/config/types/IApiServerConfig";
import {
  parseConfig,
  stringifyConfig,
} from "@/features/config/utils/serialization";
import fs from "fs/promises";
import path from "path";

const ADAPTER = ADAPTERS[process.env.NEXT_PUBLIC_ADAPTER];

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

  switch (ADAPTER.id) {
    case "enshrouded":
      const body =
        (await req.json()) as IApiServerConfig<IEnshroudedServerConfig>;

      await fs.writeFile(
        path.resolve(process.env.SERVER_CONFIG_PATH),
        stringifyConfig(body),
      );

      break;
  }

  return new Response();
};
