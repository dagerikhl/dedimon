import { useSSE } from "react-hooks-sse";
import type { IApiServerState } from "@/features/state/types/IApiServerState";

const INITIAL_STATE: IApiServerState = { status: "offline" };

export const useApiServerState = (): IApiServerState =>
  useSSE("message", INITIAL_STATE);
