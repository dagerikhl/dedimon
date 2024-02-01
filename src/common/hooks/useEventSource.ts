import {
  IEventSourceMessageHandler,
  useEventSourceStore,
} from "@/common/providers/EventSourceProvider/EventSourceContext";
import { useCallback, useEffect } from "react";

export type IEventSourceMessageCallback<T = any> = (data: T) => void;

export interface IUseEventSourceProps<T = any> {
  url: string;
  id: string;
  /** Must be memoized. */
  onMessage: IEventSourceMessageCallback<T>;
}

export const useEventSource = <T = any>({
  url,
  id,
  onMessage,
}: IUseEventSourceProps<T>) => {
  const { subscribe } = useEventSourceStore();

  const handleMessage = useCallback<IEventSourceMessageHandler>(
    ({ data }) => {
      onMessage(JSON.parse(data));
    },
    [onMessage],
  );

  useEffect(() => {
    return subscribe(url, id, handleMessage);
  }, [handleMessage, id, subscribe, url]);
};
