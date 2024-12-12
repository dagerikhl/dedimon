"use client";

import { Code } from "@/common/components/formatting/Code";
import { Dl } from "@/common/components/layout/Dl";
import { formatDatetime } from "@/common/utils/formatting/datetime";
import { IPlayerLog } from "@/features/player-log/types/IPlayerLog";
import { IPlayer } from "../types/IPlayer";
import styles from "./PlayerLogView.module.scss";

const getPlayerName = (id: string, players: Record<string, IPlayer>): string =>
  players[id]?.name ?? id;

export interface IPlayerLogViewProps {
  playerLog?: IPlayerLog;
}

export const PlayerLogView = ({ playerLog }: IPlayerLogViewProps) => {
  if (!playerLog) {
    return "-";
  }

  return (
    <div className={styles.container}>
      <Dl className={styles["dl-container"]}>
        <dt>Current players:</dt>
        <dd>
          {playerLog.currentPlayers.length > 0
            ? `[${playerLog.currentPlayers.length}]`
            : "-"}{" "}
          {playerLog.currentPlayers
            .map((id) => getPlayerName(id, playerLog.players))
            .join(", ")}
        </dd>

        <dt>Player overview:</dt>
        <dd>
          {Object.keys(playerLog.players).length > 0
            ? Object.values(playerLog.players).map(
                ({ id, name, player, character }) => (
                  <div key={id}>
                    {id}: Name={name ?? "?"}, Player={player ?? "?"}, Character=
                    {character ?? "?"}
                  </div>
                ),
              )
            : "-"}
        </dd>

        <dt>Log:</dt>
        <dd>
          {playerLog.entries.length > 0
            ? playerLog.entries.map(
                ({ id, event, timestamp, nextCurrentPlayers }) => (
                  <div key={`${id}-${event}-${timestamp}`}>
                    <Code>
                      {formatDatetime(timestamp, true)}:{" "}
                      {event === "logged-on" ? "+" : "-"}
                      {getPlayerName(id, playerLog.players)} [
                      {nextCurrentPlayers
                        .map((id) => getPlayerName(id, playerLog.players))
                        .join("+")}
                      ]
                    </Code>
                  </div>
                ),
              )
            : "-"}
        </dd>
      </Dl>
    </div>
  );
};
