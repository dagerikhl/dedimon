import type { IPlayerLog } from "@/features/player-log/types/IPlayerLog";

export interface IEnshroudedServerStateInfo {
  gameVersion?: string;
  baseCount?: number;
  entityCount?: number;
  publicIp?: string;
  lastSaved?: string;
  savedCount?: number;
  playerCount?: number;
  lastLoggedOn?: string;
  lastLoggedOff?: string;
  players?: string;
  playerLog?: IPlayerLog;
}
