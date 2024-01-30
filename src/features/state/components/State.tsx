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
import { useEffect, useState } from "react";
import styles from "./State.module.scss";

const getUptime = (started: string | undefined): string => {
  if (!started) {
    return "-";
  }

  const now = new Date();

  return formatUptime(started, now) || "-";
};

export const State = () => {
  // TODO Make a call to check that the server is online
  const [state, setState] = useState<IApiServerState>({ status: "offline" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get<IApiServerState>("/api/server/health")
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
  }, []);

  const [uptime, setUptime] = useState(getUptime(state.started));
  useEffect(() => {
    const id = setInterval(() => {
      setUptime(getUptime(state.started));
    }, 1000);

    return () => {
      clearInterval(id);
    };
  });

  const handleStartServer = async () => {
    setIsLoading(true);
    axios
      .post<IApiServerState>("/api/server/start")
      .then((res) => {
        setState(res.data);
      })
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
          {/* TODO Handle clicks to trigger server actions */}

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
            >
              Update server
            </Button>
          </div>
        </div>
      </div>

      <Loader isLoading={isLoading} />
    </>
  );
};
