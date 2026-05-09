import cz from "classnames";
import type { IUptimeMinuteAggregate } from "@/modules/uptime-gfx/types/IUptimeMinuteAggregate";
import styles from "./UptimeMark.module.css";

export interface IUptimeMarkProps {
  x: string;
  yMax: number;
  data: IUptimeMinuteAggregate;
  isStart?: boolean;
  isLive?: boolean;
  label?: string;
}

const getTooltip = (x: string, data: IUptimeMinuteAggregate): string => {
  const parts = [`${x}: ${data.total} log${data.total === 1 ? "" : "s"}`];
  if (data.player) {
    parts.push(`${data.player} player`);
  }
  if (data.save) {
    parts.push(`${data.save} save`);
  }
  if (data.error) {
    parts.push(`${data.error} error`);
  }
  return parts.join(", ");
};

export const UptimeMark = ({
  x,
  yMax,
  data,
  isStart,
  isLive,
  label,
}: IUptimeMarkProps) => {
  const totalHeightPercent = yMax > 0 ? (data.total / yMax) * 100 : 0;

  const regular = data.total - data.player - data.save - data.error;

  return (
    <div
      className={cz(styles.container, {
        [styles.live]: isLive,
        [styles.start]: isStart,
      })}
      title={getTooltip(x, data)}
    >
      <div className={styles.topLabel}>{label ?? ""}</div>
      <div className={styles.barArea}>
        {data.total > 0 && (
          <div
            className={styles.bar}
            style={{ height: `${totalHeightPercent}%` }}
          >
            {data.error > 0 && (
              <div
                className={cz(styles.segment, styles.error)}
                style={{ flex: data.error }}
              />
            )}
            {data.save > 0 && (
              <div
                className={cz(styles.segment, styles.save)}
                style={{ flex: data.save }}
              />
            )}
            {data.player > 0 && (
              <div
                className={cz(styles.segment, styles.player)}
                style={{ flex: data.player }}
              />
            )}
            {regular > 0 && (
              <div
                className={cz(styles.segment, styles.regular)}
                style={{ flex: regular }}
              />
            )}
          </div>
        )}
      </div>
      <div className={styles.separator} />
      {isStart && <div className={styles.startMarker} />}
    </div>
  );
};
