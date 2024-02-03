"use client";

import { ReactNode } from "react";
import { SSEProvider } from "react-hooks-sse";

export interface IEventSourceProviderProps {
  children?: ReactNode;
}

export const SseServerStateProvider = ({
  children,
}: IEventSourceProviderProps) => (
  <SSEProvider endpoint="/api/server/state">{children}</SSEProvider>
);
