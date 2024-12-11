import { IPlayerLogEvent } from "@/features/player-log/types/IPlayerLogEvent";

export interface IPlayerLogEntry {
  id: string;
  event: IPlayerLogEvent;
  timestamp: Date;
  prevCurrentPlayers: string[];
  nextCurrentPlayers: string[];
}
