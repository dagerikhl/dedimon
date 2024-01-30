"use client";

import { Button } from "@/common/components/buttons/Button";
import { ServerStatus } from "@/modules/server-status/components/ServerStatus";
import { IServerStatus } from "@/modules/server-status/types/IServerStatus";
import {
  formatDatetime,
  formatUptime,
} from "@/common/utils/formatting/datetime";
import {
  faCloudArrowUp,
  faPlay,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import styles from "./State.module.scss";

const getUptime = (started: string): string => {
  const now = new Date();

  return formatUptime(started, now) || "-";
};

export const State = () => {
  // TODO Get from API
  const status: IServerStatus = "running" as IServerStatus;
  // TODO Get from API
  const started = new Date(2023, 11, 30, 10, 19).toISOString();

  const [uptime, setUptime] = useState(getUptime(started));

  useEffect(() => {
    const id = setInterval(() => {
      setUptime(getUptime(started));
    }, 1000);

    return () => {
      clearInterval(id);
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.containerInner}>
        <div>
          Status: <ServerStatus status={status} />
        </div>

        <div title={`Started: ${formatDatetime(started, true)}`}>
          Uptime: {uptime}
        </div>
      </div>

      <div className={styles.containerInner}>
        {/* TODO Handle clicks to trigger server actions */}

        <div className={styles.groupHorizontal}>
          <Button
            variant="success"
            icon={faPlay}
            disabled={status === "running" || status === "offline"}
          >
            Start server
          </Button>
          <Button
            variant="error"
            icon={faStop}
            disabled={status === "stopped" || status === "offline"}
          >
            Stop server
          </Button>
        </div>

        <div className={styles.groupHorizontal}>
          <Button
            variant="accent"
            icon={faCloudArrowUp}
            disabled={status === "offline"}
          >
            Update server
          </Button>
        </div>
      </div>
    </div>
  );
};
