"use client";

import { Button } from "@/common/components/buttons/Button";
import { Loader } from "@/common/components/layout/Loader";
import { useInterval } from "@/common/hooks/useInterval";
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
import { ChangeEvent, useCallback, useState } from "react";
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

  const [uptime, setUptime] = useState(getUptime(state.started));

  const [validateUpdate, setValidateUpdate] = useState(true);

  useInterval(
    useCallback(() => {
      setUptime(getUptime(state.started));
    }, [state.started]),
    10 * 1000,
    true,
  );

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
        { action: "update", validate: validateUpdate },
      )
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleValidateUpdateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValidateUpdate(e.target.checked);
  };

  return (
    <>
      <div className={styles.container}>
        <ServerStatus className={styles.status} status={state.status} />

        <div className={styles.uptime}>
          Uptime: {uptime}{" "}
          {state.started ? (
            <span className={styles.uptimeStarted}>
              ({formatDatetime(state.started)})
            </span>
          ) : null}
        </div>

        <div className={styles.actions}>
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

        <div className={styles.update}>
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

          <label
            className={styles.validateUpdate}
            title="Validate game files after update?"
          >
            <input
              type="checkbox"
              checked={validateUpdate}
              onChange={handleValidateUpdateChange}
            />
            Validate?
          </label>
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
