import { useSSE } from "react-hooks-sse";
import type { IApiServerEvent } from "@/features/state/types/IApiServerEvent";
import type { IApiServerState } from "@/features/state/types/IApiServerState";
import { mergeInfo } from "@/features/state/utils/mergeInfo";

const INITIAL_STATE: IApiServerState = { status: "offline" };

const stateReducer = (
  state: IApiServerState,
  action: { data: IApiServerEvent },
): IApiServerState => {
  switch (action.data.kind) {
    case "snapshot":
      return action.data.state;
    case "state-patch": {
      const { patch } = action.data;
      const next: IApiServerState = { ...state };
      if (patch.status !== undefined) {
        next.status = patch.status;
      }
      if (patch.started !== undefined) {
        next.started = patch.started ?? undefined;
      }
      if (patch.info !== undefined) {
        next.info = mergeInfo(state.info, patch.info);
      }
      return next;
    }
    case "log-append": {
      const log = state.log
        ? [...state.log, ...action.data.entries]
        : [...action.data.entries];
      return { ...state, log };
    }
    default:
      return state;
  }
};

export const useApiServerState = (): IApiServerState =>
  useSSE<IApiServerState, IApiServerEvent>("message", INITIAL_STATE, {
    stateReducer,
  });
