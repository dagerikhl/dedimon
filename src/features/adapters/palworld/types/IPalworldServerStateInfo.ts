import type { IPlayerLog } from "@/features/player-log/types/IPlayerLog";

// TODO Add more state info (and fix log proxying)
export interface IPalworldServerStateInfo {
  gameVersion?: string;
  port?: string;
  playerCount?: number;
  lastLoggedOn?: string;
  lastLoggedOff?: string;
  players?: string;
  playerLog?: IPlayerLog;
}
