import { useEffect } from "react";

export type IEventSourceMessageCallback<T = any> = (data: T) => void;

export interface IUseEventSourceProps<T = any> {
  url: string;
  /** Must be memoized. */
  onMessage: IEventSourceMessageCallback<T>;
}

// TODO The EventSource should be kept in a provider to share it between components
export const useEventSource = <T = any>({
  url,
  onMessage,
}: IUseEventSourceProps<T>) => {
  useEffect(() => {
    const eventSource = new EventSource(url);

    const handleMessage = ({ data }: MessageEvent<string>) => {
      onMessage(JSON.parse(data));
    };

    eventSource.addEventListener("message", handleMessage);

    return () => {
      eventSource.close();
    };
  }, [onMessage, url]);
};
