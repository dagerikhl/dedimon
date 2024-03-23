import styles from "./UptimeMark.module.scss";

export interface IUptimeMarkProps {
  x: string;
  yMax: number;
  data: string[];
}

export const UptimeMark = ({ x, yMax, data }: IUptimeMarkProps) => {
  const height = `calc(${(data.length / yMax) * 100}% - 1px - 8px)`;

  return (
    <div
      className={styles.container}
      title={`${x}: ${data.length} log line${data.length === 1 ? "" : "s"}`}
    >
      <div className={styles.label} />
      <div className={styles.separator} />
      <div className={styles.mark} style={{ height }} />
    </div>
  );
};
