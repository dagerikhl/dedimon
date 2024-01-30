import { ServerRunner } from "@/features/server/singletons/ServerRunner";

export const POST = async () => {
  const serverRunner = ServerRunner.getInstance();

  serverRunner.stop();

  return new Response();
};
