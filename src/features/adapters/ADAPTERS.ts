import { formatDatetime } from "@/common/utils/formatting/datetime";
import { IEnshroudedServerStateInfo } from "@/features/adapters/enshrouded/types/IEnshroudedServerStateInfo";
import { IAdapterSpec } from "./types/IAdapterSpec";

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

          const aPlayerHasJoined = /\[online] Added Peer #\d+/i.test(data);
          if (aPlayerHasJoined) {
            currentPlayerCount++;
          }
          const aPlayerHasLeft = /\[online] Removed Peer #\d+/i.test(data);
          if (aPlayerHasLeft) {
            currentPlayerCount--;
          }

          return { playerCount: currentPlayerCount };
        },
      },
    },
  } satisfies IAdapterSpec<"enshrouded", IEnshroudedServerStateInfo>,
};