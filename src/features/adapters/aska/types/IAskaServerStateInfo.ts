import { IPlayerLog } from "@/features/player-log/types/IPlayerLog";

export interface IAskaServerStateInfo {
  gameVersion?: string;
  lastSaved?: string;
  savedCount?: number;
  playerCount?: number;
  lastLoggedOn?: string;
  lastLoggedOff?: string;
  players?: string;
  playerLog?: IPlayerLog;
}
