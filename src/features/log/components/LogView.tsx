"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LogView.module.scss";

const MIN_LINES = 100;

const padLog = (log: string[]): string[] => {
  if (log.length > MIN_LINES) {
    return log;
  }

  const padCount = MIN_LINES - log.length;

  return [...Array.from({ length: padCount }).map(() => " "), ...log];
};

export interface ILogViewProps {
  log: string[];
}

export const LogView = ({ log }: ILogViewProps) => {
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState(padLog(log));

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    setLines(padLog(log));
  }, [log]);

  return (
    <code className={styles.container}>
      {lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}

      <div ref={scrollAnchorRef} className={styles.scrollAnchor} />
    </code>
  );
};
