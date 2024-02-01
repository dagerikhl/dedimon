"use client";

import {
  EventSourceContext,
  IGetEventSource,
  ISubscribeToEventSource,
  IUnsubscribeFromEventSource,
} from "@/common/providers/EventSourceProvider/EventSourceContext";
import { ReactNode, useCallback, useState } from "react";

export interface IEventSourceProviderProps {
  children?: ReactNode;
}

export const EventSourceProvider = ({
  children,
}: IEventSourceProviderProps) => {
  const [eventSources, setEventSources] = useState<Record<string, EventSource>>(
    {},
  );

  const getEventSource = useCallback<IGetEventSource>(
    (url, id) => {
      const key = `${url}_${id}`;

      let eventSource: EventSource;

      if (!eventSources[key]) {
        eventSource = new EventSource(url);

        setEventSources((current) => ({ ...current, [key]: eventSource }));
      } else {
        eventSource = eventSources[key];
      }

      return eventSource;
    },
    [eventSources],
  );

  const unsubscribe = useCallback<IUnsubscribeFromEventSource>(
    (url, id, cb) => {
      const key = `${url}_${id}`;
      const eventSource = eventSources[key];

      if (!eventSource) {
        return;
      }

      eventSource.removeEventListener("message", cb);
    },
    [eventSources],
  );

  const subscribe = useCallback<ISubscribeToEventSource>(
    (url, id, cb) => {
      const eventSource = getEventSource(url, id);

      eventSource.addEventListener("message", cb);

      return () => {
        eventSource.removeEventListener("message", cb);
      };
    },
    [getEventSource],
  );

  return (
    <EventSourceContext.Provider
      value={{ eventSources, getEventSource, subscribe, unsubscribe }}
    >
      {children}
    </EventSourceContext.Provider>
  );
};
