"use client";

import { Loader } from "@/common/components/layout/Loader";
import { useApiServerState } from "@/features/api/state/hooks/useApiServerState";
import { PlayerLogView } from "@/features/player-log/components/PlayerLogView";

export const PlayerLog = () => {
  const state = useApiServerState();

  return (
    <>
      <PlayerLogView playerLog={state.info?.playerLog} />

      <Loader isLoading={state.status === "offline"} />
    </>
  );
};
