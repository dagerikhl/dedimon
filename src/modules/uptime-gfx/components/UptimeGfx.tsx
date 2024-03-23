"use client";

import { getMinuteMark } from "@/common/utils/formatting/datetime";
import { useApiServerState } from "@/features/api/state/hooks/useApiServerState";
import { getLogLineParts } from "@/features/log/utils/parsing";
import { UptimeMark } from "@/modules/uptime-gfx/components/UptimeMark";
import { useEffect, useMemo, useState } from "react";
import styles from "./UptimeGfx.module.scss";

type IUptimeByMinute = Record<string, string[]>;

const MINUTES_COUNT = 60;

const getMinutesToShow = (): string[] => {
  const now = new Date();

  const minutes = [getMinuteMark(now)];

  for (let i = 1; i <= MINUTES_COUNT; i++) {
    const minute = getMinuteMark(now, -i);

    minutes.unshift(minute);
  }

  return minutes;
};

export const UptimeGfx = () => {
  const state = useApiServerState();

  const { logsByMinute, yMax } = useMemo<{
    logsByMinute: IUptimeByMinute | undefined;
    yMax: number;
  }>(() => {
    const logsByMinute = state.log?.reduce<IUptimeByMinute>((res, cur) => {
      const [timestamp, line] = getLogLineParts(cur);

      if (timestamp) {
        const minute = timestamp.slice(0, 16);

        if (res[minute]) {
          res[minute].push(line);
        } else {
          res[minute] = [line];
        }
      }

      return res;
    }, {} as IUptimeByMinute);

    return {
      logsByMinute,
      yMax: Math.max(
        ...Object.values(logsByMinute ?? {}).map((l) => l.length),
        1,
      ),
    };
  }, [state.log]);

  const [minutesToShow, setMinutesToShow] = useState(getMinutesToShow());

  useEffect(() => {
    const id = setInterval(() => {
      setMinutesToShow(getMinutesToShow());
    }, 10 * 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div className={styles.container}>
      {minutesToShow.map((x) => (
        <UptimeMark key={x} x={x} yMax={yMax} data={logsByMinute?.[x] ?? []} />
      ))}
    </div>
  );
};
