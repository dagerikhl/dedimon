import { ServerRunner } from "@/features/server/singletons/ServerRunner";

export const POST = async () => {
  const serverRunner = ServerRunner.getInstance();

  serverRunner.start();

  return new Response();
};
