import { IApiServerState } from "@/features/state/types/IApiServerState";

// TODO Actually check that we have a stable server and SSE inited
export const GET = async () => {
  const state: IApiServerState = { status: "stopped" };

  return Response.json(state);
};
