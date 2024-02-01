import { createContext, useContext } from "react";

export type IGetEventSource = (url: string, id: string) => EventSource;

export type IEventSourceMessageHandler = (event: MessageEvent<string>) => void;

export type ISubscribeToEventSource = (
  url: string,
  id: string,
  cb: IEventSourceMessageHandler,
) => VoidFunction;

export type IUnsubscribeFromEventSource = (
  url: string,
  id: string,
  cb: IEventSourceMessageHandler,
) => void;

export interface IEventSourceStore {
  eventSources: Record<string, EventSource>;
  getEventSource: IGetEventSource;
  subscribe: ISubscribeToEventSource;
  unsubscribe: IUnsubscribeFromEventSource;
}

const EVENT_SOURCE_STORE_DEFAULT: IEventSourceStore = {
  eventSources: {},
  getEventSource: null!,
  subscribe: () => () => {},
  unsubscribe: () => {},
};

export const EventSourceContext = createContext(EVENT_SOURCE_STORE_DEFAULT);

export const useEventSourceStore = () => useContext(EventSourceContext);
