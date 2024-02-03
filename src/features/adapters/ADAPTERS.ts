import { formatDatetime } from "@/common/utils/formatting/datetime";
import { IEnshroudedServerStateInfo } from "@/features/adapters/enshrouded/types/IEnshroudedServerStateInfo";
import { IAdapterSpec } from "./types/IAdapterSpec";

const ENSHROUDED_RE = {
  serverSaved: /\[server] Saved/i,
  playerJoined: /\[online] Added Peer #\d+/i,
  playerLeft: /\[online] Removed Peer #\d+/i,
};

const toNumberIfDefined = (
  value: string | undefined,
  offset?: number,
): number | undefined => (value ? +value + (offset ?? 0) : undefined);

export const ADAPTERS = {
  enshrouded: {
    id: "enshrouded",
    configSpec: {
      type: "json",
      indent: "\t",
      newlineEof: false,
    },
    stateInfoSpec: {
      checkStarted: (data, _current) =>
        /\[Session] 'HostOnline' \(up\)!/i.test(data),
      infoGetters: [
        (data, _current) => ({
          gameVersion: data.match(/Game Version \(SVN\): (\d+)/i)?.[1],
        }),
        (data, _current) => {
          const countingMatches = data.match(
            /\[savexxx] LOAD (\d+) bases (\d+) entities/i,
          );

          return {
            baseCount: toNumberIfDefined(countingMatches?.[1]),
            entityCount: toNumberIfDefined(countingMatches?.[2]),
          };
        },
        (data, _current) => ({
          publicIp: data.match(
            /\[online] Public ipv4: (\d+\.\d+\.\d+\.\d+)/i,
          )?.[1],
        }),
        (data, current) => ({
          lastSaved: ENSHROUDED_RE.serverSaved.test(data)
            ? formatDatetime(new Date(), true)
            : undefined,
          savedCount: ENSHROUDED_RE.serverSaved.test(data)
            ? (current?.savedCount ?? 0) + 1
            : undefined,
        }),
        (data, current) => {
          let currentPlayerCount = current?.playerCount ?? 0;
          let isJoinEvent = false;
          let isLeaveEvent = false;
          if (ENSHROUDED_RE.playerJoined.test(data)) {
            isJoinEvent = true;
            currentPlayerCount++;
          }
          if (ENSHROUDED_RE.playerLeft.test(data)) {
            isLeaveEvent = true;
            currentPlayerCount--;
          }

          return {
            playerCount: currentPlayerCount,
            lastLoggedOn: isJoinEvent
              ? formatDatetime(new Date(), true)
              : undefined,
            lastLoggedOff: isLeaveEvent
              ? formatDatetime(new Date(), true)
              : undefined,
          };
        },
      ],
    },
  } satisfies IAdapterSpec<"enshrouded", IEnshroudedServerStateInfo>,
};
