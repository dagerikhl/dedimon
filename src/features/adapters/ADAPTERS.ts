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
    name: "Enshrouded",
    logo: {
      src: "data:image/png;base64,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",
      height: 71,
      width: 410,
      omitTextFromLogoBanner: true,
    },
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
