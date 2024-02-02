import { formatDatetime } from "@/common/utils/formatting/datetime";
import { IEnshroudedServerStateInfo } from "@/features/adapters/enshrouded/types/IEnshroudedServerStateInfo";
import { IAdapterSpec } from "./types/IAdapterSpec";

// Enshrouded START

const ENSHROUDED_PLAYER_JOINED_RE = /\[online] Added Peer #\d+/i;
const ENSHROUDED_PLAYER_LEFT_RE = /\[online] Removed Peer #\d+/i;

// Enshrouded END

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
      infoGetters: {
        gameVersion: (data, _current) => ({
          gameVersion: data.match(/Game Version \(SVN\): (\d+)/i)?.[1],
        }),
        baseCount: (data, _current) => ({
          baseCount: toNumberIfDefined(
            data.match(/\[savexxx] LOAD (\d+) bases \d+ entities/i)?.[1],
          ),
        }),
        entityCount: (data, _current) => ({
          entityCount: toNumberIfDefined(
            data.match(/\[savexxx] LOAD \d+ bases (\d+) entities/i)?.[1],
          ),
        }),
        publicIp: (data, _current) => ({
          publicIp: data.match(
            /\[online] Public ipv4: (\d+\.\d+\.\d+\.\d+)/i,
          )?.[1],
        }),
        lastSaved: (data, _current) => ({
          lastSaved: /\[server] Saved/i.test(data)
            ? formatDatetime(new Date(), true)
            : undefined,
        }),
        savedCount: (data, current) => ({
          savedCount: /\[server] Saved/i.test(data)
            ? (current?.savedCount ?? 0) + 1
            : undefined,
        }),
        playerCount: (data, current) => {
          let currentPlayerCount = current?.playerCount ?? 0;
          if (ENSHROUDED_PLAYER_JOINED_RE.test(data)) {
            currentPlayerCount++;
          }
          if (ENSHROUDED_PLAYER_LEFT_RE.test(data)) {
            currentPlayerCount--;
          }

          return { playerCount: currentPlayerCount };
        },
        lastLoggedOn: (data, _current) => ({
          lastLoggedOn: ENSHROUDED_PLAYER_JOINED_RE.test(data)
            ? formatDatetime(new Date(), true)
            : undefined,
        }),
        lastLoggedOff: (data, _current) => ({
          lastLoggedOff: ENSHROUDED_PLAYER_LEFT_RE.test(data)
            ? formatDatetime(new Date(), true)
            : undefined,
        }),
      },
    },
  } satisfies IAdapterSpec<"enshrouded", IEnshroudedServerStateInfo>,
};
