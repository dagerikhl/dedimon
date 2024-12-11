import { formatDatetime } from "@/common/utils/formatting/datetime";
import { LOGO } from "@/features/adapters/aska/constants/LOGO";
import { IAskaServerStateInfo } from "@/features/adapters/aska/types/IAskaServerStateInfo";
import { IAdapterSpec } from "@/features/adapters/types/IAdapterSpec";
import { IPlayer } from "@/features/player-log/types/IPlayer";
import { IPlayerLog } from "@/features/player-log/types/IPlayerLog";
import { IPlayerLogEntry } from "@/features/player-log/types/IPlayerLogEntry";
import { IPlayerLogEvent } from "@/features/player-log/types/IPlayerLogEvent";

const ASKA_RE = {
  serverSaved: /Saving: Flushing done!/i,
  playerJoined: /^(.+) connected!/i,
  playerLeft: /^(.+) disconnected!/i,
};

export const ASKA_ADAPTER_SPEC: IAdapterSpec<"aska", IAskaServerStateInfo> = {
  id: "aska",
  name: "Aska",
  logo: {
    src: LOGO,
    height: 715,
    width: 1440,
    omitTextFromLogoBanner: true,
    inverted: true,
  },
  configSpecs: {
    "server properties.txt": {
      type: "text",
      indent: "\t",
      newline: "\r\n",
      newlineEof: true,
    },
    "server properties.backup.txt": {
      type: "text",
      indent: "\t",
      newline: "\r\n",
      newlineEof: true,
    },
  },
  stateInfoSpec: {
    checkStarted: (data, _current) => /The session is now open!/i.test(data),
    infoGetters: [
      (data, _current) => ({
        gameVersion: data.match(/Running game version:\s*(.+)/i)?.[1],
      }),
      (data, current) => ({
        lastSaved: ASKA_RE.serverSaved.test(data)
          ? formatDatetime(new Date(), true)
          : undefined,
        savedCount: ASKA_RE.serverSaved.test(data)
          ? (current?.savedCount ?? 0) + 1
          : undefined,
      }),
      (data, _current) => {
        if (ASKA_RE.playerJoined.test(data)) {
          return {
            lastLoggedOn: formatDatetime(new Date(), true),
          };
        }

        if (ASKA_RE.playerLeft.test(data)) {
          return {
            lastLoggedOff: formatDatetime(new Date(), true),
          };
        }

        return {};
      },
      (data, current) => {
        const playerLog: IPlayerLog = current?.playerLog ?? {
          players: {},
          currentPlayers: [],
          entries: [],
        };

        const players = new Set(
          current?.players ? current.players.split(", ") : [],
        );

        let playerId: string | undefined;
        let playerLogEvent: IPlayerLogEvent | undefined;

        const joinedPlayerMatch = data.match(ASKA_RE.playerJoined);
        if (joinedPlayerMatch?.[1]) {
          playerId = joinedPlayerMatch[1];
          playerLogEvent = "logged-on";

          players.add(playerId);
        }

        const leftPlayer = data.match(ASKA_RE.playerLeft)?.[1];
        if (leftPlayer) {
          playerId = leftPlayer;
          playerLogEvent = "logged-off";

          players.delete(playerId);
        }

        if (playerId && playerLogEvent) {
          const player: IPlayer = {
            id: playerId,
            name: playerId,
            player: playerId,
          };

          playerLog.players[playerId] = player;

          const nextCurrentPlayersSet = new Set(playerLog.currentPlayers);
          if (playerLogEvent === "logged-on") {
            nextCurrentPlayersSet.add(playerId);
          } else {
            nextCurrentPlayersSet.delete(playerId);
          }

          const playerLogEntry: IPlayerLogEntry = {
            id: playerId,
            event: playerLogEvent,
            timestamp: new Date(),
            prevCurrentPlayers: [...playerLog.currentPlayers],
            nextCurrentPlayers: Array.from(nextCurrentPlayersSet),
          };

          playerLog.currentPlayers = Array.from(nextCurrentPlayersSet);

          playerLog.entries.unshift(playerLogEntry);
        }

        return {
          players: Array.from(players).join(", "),
          playerCount: players.size,
          playerLog,
        };
      },
    ],
  },
};
