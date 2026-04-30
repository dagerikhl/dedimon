import type { IPlayer } from "./IPlayer";
import type { IPlayerLogEntry } from "./IPlayerLogEntry";

export interface IPlayerLog {
  players: Record<string, IPlayer>;
  currentPlayers: string[];
  entries: IPlayerLogEntry[];
}
