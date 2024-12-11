"use client";

import { Dl } from "@/common/components/layout/Dl";
import { IPlayerLog } from "@/features/player-log/types/IPlayerLog";
import { Fragment } from "react";
import { IPlayer } from "../types/IPlayer";
import { formatDatetime } from "@/common/utils/formatting/datetime";

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
    <Dl>
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
        {Object.keys(playerLog.players).length > 0 ? (
          <Dl>
            {Object.values(playerLog.players).map(
              ({ id, name, player, character }) => (
                <Fragment key={id}>
                  <dt>{id}:</dt>
                  <dd>
                    Name={name ?? "?"}, Player={player ?? "?"}, Character=
                    {character ?? "?"}
                  </dd>
                </Fragment>
              ),
            )}
          </Dl>
        ) : (
          "-"
        )}
      </dd>

      <dt>Log:</dt>
      <dd>
        {playerLog.entries.length > 0 ? (
          <Dl>
            {playerLog.entries.map(
              ({ id, event, timestamp, nextCurrentPlayers }) => (
                <Fragment key={`${id}-${event}-${timestamp}`}>
                  <dt>{formatDatetime(timestamp, true)}:</dt>
                  <dd>
                    {getPlayerName(id, playerLog.players)} {event} [current
                    players=
                    {nextCurrentPlayers
                      .map((id) => getPlayerName(id, playerLog.players))
                      .join(", ")}
                    ]
                  </dd>
                </Fragment>
              ),
            )}
          </Dl>
        ) : (
          "-"
        )}
      </dd>
    </Dl>
  );
};
