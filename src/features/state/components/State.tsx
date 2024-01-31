"use client";

import { Button } from "@/common/components/buttons/Button";
import { Loader } from "@/common/components/layout/Loader";
import { useApiServerState } from "@/features/api/state/hooks/useApiServerState";
import { IApiServerState } from "@/features/state/types/IApiServerState";
import { IApiServerUpdatePayload } from "@/features/state/types/IApiServerUpdatePayload";
import { ServerStatus } from "@/modules/server-status/components/ServerStatus";
import {
  formatDatetime,
  formatUptime,
} from "@/common/utils/formatting/datetime";
import {
  faCloudArrowUp,
  faPlay,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import axios, { AxiosResponse } from "axios";
import { useMemo, useState } from "react";
import styles from "./State.module.scss";

const getUptime = (started: string | undefined): string => {
  if (!started) {
    return "-";
  }

  const now = new Date();

  return formatUptime(started, now) || "0 minutes";
};

export const State = () => {
  const [isLoading, setIsLoading] = useState(false);

  const state = useApiServerState();

  const uptime = useMemo(() => getUptime(state.started), [state.started]);

  const handleStartServer = async () => {
    setIsLoading(true);
    axios
      .post<
        IApiServerState,
        AxiosResponse<IApiServerState>,
        IApiServerUpdatePayload
      >("/api/server/state", { action: "start" })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleStopServer = async () => {
    setIsLoading(true);
    axios
      .post<void, AxiosResponse<void>, IApiServerUpdatePayload>(
        "/api/server/state",
        { action: "stop" },
      )
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateServer = async () => {
    setIsLoading(true);
    axios
      .post<void, AxiosResponse<void>, IApiServerUpdatePayload>(
        "/api/server/state",
        { action: "update" },
      )
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerInner}>
          <div>
            Status: <ServerStatus status={state.status} />
          </div>

          <div
            title={`Started: ${state.started ? formatDatetime(state.started, true) : "-"}`}
          >
            Uptime: {uptime}
          </div>
        </div>

        <div className={styles.containerInner}>
          <div className={styles.groupHorizontal}>
            <Button
              variant="success"
              icon={faPlay}
              disabled={state.status !== "stopped"}
              onClick={handleStartServer}
            >
              Start server
            </Button>

            <Button
              variant="error"
              icon={faStop}
              disabled={state.status !== "running"}
              onClick={handleStopServer}
            >
              Stop server
            </Button>
          </div>

          <div className={styles.groupHorizontal}>
            <Button
              variant="accent"
              icon={faCloudArrowUp}
              disabled={
                state.status === "offline" ||
                state.status === "starting" ||
                state.status === "stopping"
              }
              onClick={handleUpdateServer}
            >
              Update server
            </Button>
          </div>
        </div>
      </div>

      <Loader
        isLoading={
          state.status === "offline" ||
          (isLoading && state.status !== "running")
        }
      />
    </>
  );
};
