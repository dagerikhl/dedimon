import { ServerRunner } from "@/features/server/singletons/ServerRunner";

export const GET = async () => {
  const serverRunner = ServerRunner.getInstance();

  return Response.json(serverRunner.getState());
};
