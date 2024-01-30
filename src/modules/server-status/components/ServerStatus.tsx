import { IServerStatus } from "@/modules/server-status/types/IServerStatus";
import {
  formatServerStatus,
  getServerStatusColor,
  getServerStatusIcon,
} from "@/modules/server-status/utils/formatting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IServerStatusProps {
  status?: IServerStatus;
}

export const ServerStatus = ({ status }: IServerStatusProps) => (
  <span>
    <FontAwesomeIcon
      icon={getServerStatusIcon(status)}
      color={getServerStatusColor(status)}
    />{" "}
    {formatServerStatus(status)}
  </span>
);
