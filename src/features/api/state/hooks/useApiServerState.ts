import { IApiServerState } from "@/features/state/types/IApiServerState";
import { useSSE } from "react-hooks-sse";

const INITIAL_STATE: IApiServerState = { status: "offline" };

export const useApiServerState = (): IApiServerState =>
  useSSE("message", INITIAL_STATE);
