import { useEventSource } from "@/common/hooks/useEventSource";
import { IApiServerState } from "@/features/state/types/IApiServerState";
import { useCallback, useState } from "react";

export const useApiServerState = (): IApiServerState => {
  const [state, setState] = useState<IApiServerState>({ status: "offline" });

  useEventSource<IApiServerState>({
    url: "/api/server/state",
    onMessage: useCallback((data) => {
      setState(data);
    }, []),
  });

  return state;
};
