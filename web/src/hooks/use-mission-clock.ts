"use client";

import { useSyncExternalStore } from "react";

import { missionClock } from "@/lib/mission-clock";

const TICK_MS = 1000;
const SERVER_CLOCK = "000:00:00:00";

export function useMissionClock(): string {
  return useSyncExternalStore(
    (onStoreChange) => {
      const id = window.setInterval(onStoreChange, TICK_MS);
      return () => window.clearInterval(id);
    },
    () => missionClock(),
    () => SERVER_CLOCK,
  );
}
