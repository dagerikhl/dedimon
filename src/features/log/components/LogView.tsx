"use client";

import { Code } from "@/common/components/formatting/Code";
import { getLogLineParts } from "@/features/log/utils/parsing";
import { useEffect, useRef, useState } from "react";
import styles from "./LogView.module.scss";

const MIN_LINES = 100;

const padLog = (log: string[]): string[] => {
  if (log.length > MIN_LINES) {
    return log;
  }

  const padCount = MIN_LINES - log.length;

  return [
    ...Array.from({ length: padCount - 1 }).map(() => " "),
    `${"-".repeat(20)} START OF LOG ${"-".repeat(20)}`,
    ...log,
  ];
};

export interface ILogViewProps {
  log: string[];
}

export const LogView = ({ log }: ILogViewProps) => {
  const scrollContainerRef = useRef<HTMLElement>(null);

  const [lines, setLines] = useState(padLog(log));

  useEffect(() => {
    scrollContainerRef.current?.scrollTo(0, 10000);
  }, []);

  useEffect(() => {
    setLines(padLog(log));
  }, [log]);

  return (
    <Code ref={scrollContainerRef} className={styles.container}>
      {lines.map((line, i) => {
        const [timestamp, logLine] = getLogLineParts(line);

        return (
          <div key={i} className={styles.line}>
            {timestamp && <div className={styles.timestamp}>[{timestamp}]</div>}
            <div className={styles.text}>{logLine}</div>
          </div>
        );
      })}

      <div className={styles.scrollAnchor} />
    </Code>
  );
};
