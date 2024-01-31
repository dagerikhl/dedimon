"use client";

import { useApiServerState } from "@/features/api/state/hooks/useApiServerState";
import { LogView } from "@/features/log/components/LogView";

export const Log = () => {
  const state = useApiServerState();

  return <LogView log={state.log ?? []} />;
};
