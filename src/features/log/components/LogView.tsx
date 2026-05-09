"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { CopyButton } from "@/common/components/buttons/CopyButton";
import { DownloadButton } from "@/common/components/buttons/DownloadButton";
import { ScrollToBottomButton } from "@/common/components/buttons/ScrollToBottomButton";
import { Positioned } from "@/common/components/layout/Positioned";
import { download } from "@/common/utils/files/download";
import { formatDatetimeSafe } from "@/common/utils/formatting/datetime";
import { ADAPTERS } from "@/features/adapters/ADAPTERS";
import { getLogLineParts } from "@/features/log/utils/parsing";
import styles from "./LogView.module.css";

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

const getTime = (timestamp: string | undefined): string | undefined =>
  timestamp ? timestamp.slice(-8) : undefined;

const LogLine = memo(({ line }: { line: string }) => {
  const [timestamp, body] = getLogLineParts(line);
  const time = getTime(timestamp);

  return (
    <div className={styles.line}>
      <div
        className={styles.timestamp}
        title={timestamp ? `[${timestamp}]` : undefined}
      >
        {time ?? ""}
      </div>
      <div className={styles.text}>{body}</div>
    </div>
  );
});
LogLine.displayName = "LogLine";

export interface ILogViewProps {
  log: string[];
}

export const LogView = ({ log }: ILogViewProps) => {
  const lines = useMemo(() => padLog(log), [log]);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const isInitializedRef = useRef(false);
  if (!isInitializedRef.current && log.length > 0) {
    isInitializedRef.current = true;
  }

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isTailing, setIsTailing] = useState(true);
  const isTailingRef = useRef(isTailing);
  useEffect(() => {
    isTailingRef.current = isTailing;
  }, [isTailing]);

  const scrollToBottom = useCallback(() => {
    virtuosoRef.current?.scrollTo({ top: 1e9 });
  }, []);

  useEffect(() => {
    if (!isTailing || lines.length === 0) {
      return;
    }

    let frame: number | undefined;
    let attempts = 0;
    const tick = () => {
      scrollToBottom();
      attempts++;
      if (attempts < 4) {
        frame = requestAnimationFrame(tick);
      }
    };
    tick();

    return () => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
    };
  }, [isTailing, lines.length, scrollToBottom]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY < 0 && isTailing) {
      setIsTailing(false);
    }
  };

  const handleAtBottomStateChange = (atBottom: boolean) => {
    if (atBottom && !isTailing) {
      setIsTailing(true);
    }
  };

  const handleTotalListHeightChanged = () => {
    if (isTailingRef.current) {
      scrollToBottom();
    }
  };

  const handleScrollToBottom = () => {
    setIsTailing(true);
    scrollToBottom();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(lines.join("\n"));
  };

  const handleDownload = () => {
    const filename = `Dedimon_Log_${ADAPTER.id}_${formatDatetimeSafe(new Date(), true, true)}`;

    download(filename, lines.join("\n"));
  };

  return (
    <>
      <div className={styles.container} onWheel={handleWheel}>
        {isMounted && (
          <Virtuoso
            key={isInitializedRef.current ? "data" : "empty"}
            ref={virtuosoRef}
            className={styles.virtuoso}
            style={{ height: "100%" }}
            data={lines}
            initialTopMostItemIndex={{
              index: lines.length - 1,
              align: "end",
            }}
            atBottomThreshold={16}
            atBottomStateChange={handleAtBottomStateChange}
            totalListHeightChanged={handleTotalListHeightChanged}
            itemContent={(_index, line) => <LogLine line={line} />}
          />
        )}
      </div>

      <Positioned position="top-right">
        <CopyButton onClick={handleCopy} />

        <DownloadButton onClick={handleDownload} />
      </Positioned>

      {!isTailing && (
        <Positioned position="bottom-right">
          <ScrollToBottomButton onClick={handleScrollToBottom} />
        </Positioned>
      )}
    </>
  );
};
