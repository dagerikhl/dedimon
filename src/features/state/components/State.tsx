"use client";

import { Button } from "@/common/components/buttons/Button";
import { Loader } from "@/common/components/layout/Loader";
import { IApiServerState } from "@/features/state/types/IApiServerState";
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
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import styles from "./State.module.scss";

const getUptime = (started: string | undefined): string => {
  if (!started) {
    return "-";
  }

  const now = new Date();

  return formatUptime(started, now) || "-";
};

export const State = () => {
  const [state, setState] = useState<IApiServerState>({ status: "offline" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getState = () => {
      setIsLoading(true);
      axios
        .get<IApiServerState>("/api/server/state")
        .then((res) => {
          setState(res.data);
        })
        .catch((e) => {
          setState({ status: "offline" });

          console.error(e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    getState();

    const id = setInterval(getState, 2 * 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  const uptime = useMemo(() => getUptime(state.started), [state.started]);

  const handleStartServer = async () => {
    setIsLoading(true);
    axios
      .post<IApiServerState>("/api/server/start")
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
      .post<IApiServerState>("/api/server/stop")
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
            {/* TODO Handle click to trigger update via SteamCMD */}
            <Button
              variant="accent"
              icon={faCloudArrowUp}
              disabled={
                state.status === "offline" ||
                state.status === "starting" ||
                state.status === "stopping"
              }
            >
              Update server
            </Button>
          </div>
        </div>
      </div>

      <Loader isLoading={isLoading && state.status !== "running"} />
    </>
  );
};
