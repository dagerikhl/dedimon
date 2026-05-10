import type { IServerStatus } from "@/modules/server-status/types/IServerStatus";

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
    case "running":
      return "var(--col-pos)";
    case "stopping":
    case "stopped":
    case "offline":
      return "var(--col-neg)";
    default:
      return undefined;
  }
};

export const isServerStatusTransitional = (
  status: IServerStatus | undefined,
): boolean => status === "starting" || status === "stopping";
