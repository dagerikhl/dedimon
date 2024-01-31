import { IServerStatus } from "@/modules/server-status/types/IServerStatus";
import {
  faBan,
  faCircleQuestion,
  faPlay,
  faSpinner,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export const formatServerStatus = (
  status: IServerStatus | undefined,
): string => {
  switch (status) {
    case "starting":
      return "Starting";
    case "running":
      return "Running";
    case "stopping":
      return "Stopping";
    case "stopped":
      return "Stopped";
    case "offline":
      return "Offline";
    default:
      return "Unknown";
  }
};

export const getServerStatusColor = (
  status: IServerStatus | undefined,
): string | undefined => {
  switch (status) {
    case "starting":
      return "var(--col-pos)";
    case "running":
      return "var(--col-pos)";
    case "stopping":
      return "var(--col-neg)";
    case "stopped":
      return "var(--col-neg)";
    case "offline":
      return "var(--col-neg)";
    default:
      return undefined;
  }
};

export const getServerStatusIconProps = (
  status: IServerStatus | undefined,
): FontAwesomeIconProps => {
  switch (status) {
    case "starting":
      return { icon: faSpinner, spinPulse: true };
    case "running":
      return { icon: faPlay };
    case "stopping":
      return { icon: faSpinner, spinPulse: true };
    case "stopped":
      return { icon: faStop };
    case "offline":
      return { icon: faBan };
    default:
      return { icon: faCircleQuestion };
  }
};
