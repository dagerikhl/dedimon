import { IServerStatus } from "@/modules/server-status/types/IServerStatus";
import {
  formatServerStatus,
  getServerStatusColor,
  getServerStatusIconProps,
} from "@/modules/server-status/utils/formatting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IServerStatusProps {
  status?: IServerStatus;
}

export const ServerStatus = ({ status }: IServerStatusProps) => (
  <span>
    {formatServerStatus(status)}{" "}
    <FontAwesomeIcon
      {...getServerStatusIconProps(status)}
      color={getServerStatusColor(status)}
    />
  </span>
);
