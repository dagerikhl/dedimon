"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getMinuteMark } from "@/common/utils/formatting/datetime";
import { ADAPTERS } from "@/features/adapters/ADAPTERS";
import { useApiServerState } from "@/features/api/state/hooks/useApiServerState";
import { getLogLineParts } from "@/features/log/utils/parsing";
import { UptimeMark } from "@/modules/uptime-gfx/components/UptimeMark";
import type { IUptimeMinuteAggregate } from "@/modules/uptime-gfx/types/IUptimeMinuteAggregate";
import styles from "./UptimeGfx.module.css";

const MINUTES_COUNT = 60;
const LABEL_INTERVAL_MINUTES = 15;
const ADAPTER = ADAPTERS[process.env.NEXT_PUBLIC_ADAPTER];

const EMPTY_AGGREGATE: IUptimeMinuteAggregate = {
  total: 0,
  player: 0,
  save: 0,
  error: 0,
};

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

  const [aggregate, setAggregate] = useState<
    Map<string, IUptimeMinuteAggregate>
  >(() => new Map());
  const lastIndexRef = useRef(0);

  useEffect(() => {
    const log = state.log;
    if (!log) {
      return;
    }

    let startIndex = lastIndexRef.current;
    if (log.length < startIndex) {
      startIndex = 0;
    }

    if (log.length === startIndex) {
      return;
    }

    setAggregate((prev) => {
      const next = new Map(prev);

      for (let i = startIndex; i < log.length; i++) {
        const line = log[i];
        const [timestamp, body] = getLogLineParts(line);
        if (!timestamp) {
          continue;
        }

        const minute = timestamp.slice(0, 16);
        const current = next.get(minute) ?? { ...EMPTY_AGGREGATE };

        const category = ADAPTER.stateInfoSpec.categorizeLogLine?.(body);

        next.set(minute, {
          total: current.total + 1,
          player: current.player + (category === "player" ? 1 : 0),
          save: current.save + (category === "save" ? 1 : 0),
          error: current.error + (category === "error" ? 1 : 0),
        });
      }

      return next;
    });

    lastIndexRef.current = log.length;
  }, [state.log]);

  const [startMinutes, setStartMinutes] = useState<Set<string>>(
    () => new Set(),
  );
  const lastStartedRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.started && state.started !== lastStartedRef.current) {
      const minute = getMinuteMark(new Date(state.started));
      setStartMinutes((prev) => {
        if (prev.has(minute)) {
          return prev;
        }
        const next = new Set(prev);
        next.add(minute);
        return next;
      });
    }
    lastStartedRef.current = state.started;
  }, [state.started]);

  const [minutesToShow, setMinutesToShow] = useState(getMinutesToShow());
  const currentMinute = minutesToShow[minutesToShow.length - 1];

  useEffect(() => {
    const id = setInterval(() => {
      setMinutesToShow(getMinutesToShow());
    }, 10 * 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  const yMax = useMemo(() => {
    let max = 1;
    for (const minute of minutesToShow) {
      const data = aggregate.get(minute);
      if (data && data.total > max) {
        max = data.total;
      }
    }
    return max;
  }, [aggregate, minutesToShow]);

  return (
    <div className={styles.container}>
      <div className={styles.grid} />
      <div className={styles.marks}>
        {minutesToShow.map((x) => {
          const data = aggregate.get(x) ?? EMPTY_AGGREGATE;
          const minute = Number(x.slice(-2));
          const showLabel = minute % LABEL_INTERVAL_MINUTES === 0;

          return (
            <UptimeMark
              key={x}
              x={x}
              yMax={yMax}
              data={data}
              isStart={startMinutes.has(x)}
              isLive={x === currentMinute}
              label={showLabel ? x.slice(-5) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};
