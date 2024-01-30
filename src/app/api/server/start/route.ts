import { IApiServerState } from "@/features/state/types/IApiServerState";

// TODO Actually start a server and get som status
export const POST = async () => {
  console.log("Starting server...");

  const state: IApiServerState = { status: "starting" };

  return Response.json(state);
};
