import { IPlayer } from "./IPlayer";
import { IPlayerLogEntry } from "./IPlayerLogEntry";

export interface IPlayerLog {
  players: Record<string, IPlayer>;
  currentPlayers: string[];
  entries: IPlayerLogEntry[];
}
