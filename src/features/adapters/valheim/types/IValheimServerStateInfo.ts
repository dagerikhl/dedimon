import type { IPlayerLog } from "@/features/player-log/types/IPlayerLog";

// TODO Add more state info
export interface IValheimServerStateInfo {
  name?: string;
  joinCode?: string;
  ip?: string;
  port?: string;

  // TODO Determine if any of these are gettable, impl. if they are
  gameVersion?: string;
  playerCount?: number;
  lastLoggedOn?: string;
  lastLoggedOff?: string;
  players?: string;
  playerLog?: IPlayerLog;
}
