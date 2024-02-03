import { IServerStatus } from "@/modules/server-status/types/IServerStatus";
import {
  formatServerStatus,
  getServerStatusColor,
  getServerStatusIconProps,
} from "@/modules/server-status/utils/formatting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cz from "classnames";
import styles from "./ServerStatus.module.scss";

export interface IServerStatusProps {
  className?: string;
  status?: IServerStatus;
}

export const ServerStatus = ({ className, status }: IServerStatusProps) => (
  <div className={cz(className, styles.container)}>
    <FontAwesomeIcon
      {...getServerStatusIconProps(status)}
      size="2xl"
      color={getServerStatusColor(status)}
    />

    <div>{formatServerStatus(status)}</div>
  </div>
);
