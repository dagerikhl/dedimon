import { IServerStatus } from "@/modules/server-status/types/IServerStatus";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBan,
  faCircleQuestion,
  faPlay,
  faStop,
} from "@fortawesome/free-solid-svg-icons";

export const formatServerStatus = (
  status: IServerStatus | undefined,
): string => {
  switch (status) {
    case "running":
      return "Running";
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
    case "running":
      return "var(--col-pos)";
    case "stopped":
      return "var(--col-neg)";
    case "offline":
      return "var(--col-neg)";
    default:
      return undefined;
  }
};

export const getServerStatusIcon = (
  status: IServerStatus | undefined,
): IconProp => {
  switch (status) {
    case "running":
      return faPlay;
    case "stopped":
      return faStop;
    case "offline":
      return faBan;
    default:
      return faCircleQuestion;
  }
};
