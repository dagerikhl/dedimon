import cz from "classnames";
import type { CSSProperties } from "react";
import type { IServerStatus } from "@/modules/server-status/types/IServerStatus";
import {
  formatServerStatus,
  getServerStatusColor,
  isServerStatusTransitional,
} from "@/modules/server-status/utils/formatting";
import styles from "./ServerStatus.module.css";

export interface IServerStatusProps {
  className?: string;
  status?: IServerStatus;
}

export const ServerStatus = ({ className, status }: IServerStatusProps) => {
  const style = {
    "--status-color": getServerStatusColor(status),
  } as CSSProperties;

  return (
    <div className={cz(className, styles.container)} style={style}>
      <div
        className={cz(styles.dot, {
          [styles.transitional]: isServerStatusTransitional(status),
        })}
      />

      <div className={styles.text}>{formatServerStatus(status)}</div>
    </div>
  );
};
