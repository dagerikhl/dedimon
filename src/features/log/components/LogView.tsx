"use client";

import { CopyButton } from "@/common/components/buttons/CopyButton";
import { DownloadButton } from "@/common/components/buttons/DownloadButton";
import { Code } from "@/common/components/formatting/Code";
import { Positioned } from "@/common/components/layout/Positioned";
import { download } from "@/common/utils/files/download";
import { formatDatetimeSafe } from "@/common/utils/formatting/datetime";
import { ADAPTERS } from "@/features/adapters/ADAPTERS";
import { getLogLineParts } from "@/features/log/utils/parsing";
import { useEffect, useRef, useState } from "react";
import styles from "./LogView.module.scss";

const MIN_LINES = 100;
const ADAPTER = ADAPTERS[process.env.NEXT_PUBLIC_ADAPTER];

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

  const getFilename = () =>
    `Dedimon_Log_${ADAPTER.id}_${formatDatetimeSafe(new Date(), true, true)}`;
  const [filename, setFilename] = useState(getFilename());
  const content = lines.join("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  const handleDownloadHover = () => {
    setFilename(getFilename());
  };
  const handleDownload = () => {
    download(filename, content);
  };

  return (
    <>
      <Code ref={scrollContainerRef} className={styles.container}>
        {lines.map((line, i) => {
          const [timestamp, logLine] = getLogLineParts(line);

          return (
            <div key={i} className={styles.line}>
              {timestamp && (
                <div className={styles.timestamp}>[{timestamp}]</div>
              )}
              <div className={styles.text}>{logLine}</div>
            </div>
          );
        })}

        <div className={styles.scrollAnchor} />
      </Code>

      <Positioned position="top-right">
        <CopyButton onClick={handleCopy} />

        <DownloadButton
          name={filename}
          onMouseOver={handleDownloadHover}
          onClick={handleDownload}
        />
      </Positioned>
    </>
  );
};
