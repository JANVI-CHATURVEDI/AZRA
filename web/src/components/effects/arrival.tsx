"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { useMissionClock } from "@/hooks/use-mission-clock";
import {
  readSessionFlag,
  subscribeToSessionFlag,
  writeSessionFlag,
} from "@/hooks/use-session-flag";

import { LetterBloat } from "./letter-bloat";

const SEEN_KEY = "azra:arrival-seen";
const DISMISS_AFTER_MS = 4200;
const COUNTDOWN_TICK_MS = 280;

function shouldPlayArrival(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  return !readSessionFlag(SEEN_KEY);
}

export function Arrival() {
  const playing = useSyncExternalStore(subscribeToSessionFlag, shouldPlayArrival, () => false);

  const dismiss = useCallback(() => writeSessionFlag(SEEN_KEY), []);

  if (!playing) return null;

  return <ArrivalSequence onDismiss={dismiss} />;
}

function ArrivalSequence({ onDismiss }: { onDismiss: () => void }) {
  const [count, setCount] = useState(9);
  const clock = useMissionClock();

  useEffect(() => {
    const countdownId = window.setInterval(() => {
      setCount((previous) => Math.max(0, previous - 1));
    }, COUNTDOWN_TICK_MS);
    const autoDismiss = window.setTimeout(onDismiss, DISMISS_AFTER_MS);

    return () => {
      window.clearInterval(countdownId);
      window.clearTimeout(autoDismiss);
    };
  }, [onDismiss]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Escape" || event.key === " ") {
        onDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onDismiss]);

  return (
    <div
      className="arrival-hold fixed inset-0 z-[180] flex flex-col bg-paper text-ink"
      onClick={onDismiss}
      role="dialog"
      aria-label="Arrival sequence"
    >
      <div className="flex flex-1 flex-col justify-center px-5 pt-10 sm:px-10">
        <div className="mb-6 flex items-end justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-paper-muted sm:text-[11px] sm:tracking-[0.28em]">
          <span>Your arrival will be in</span>
          <span className="max-w-[45%] text-right">Please, stay in your seats</span>
        </div>

        <div className="relative">
          <div className="h-px w-full bg-ink/25" />
          <div className="relative -mt-px grid grid-cols-[1fr_auto_1fr] items-start">
            <div className="mt-[27px] h-px bg-ink/25" />
            <div className="flex w-[min(48vw,320px)] flex-col items-center">
              <div className="h-7 w-full border-x border-b border-ink/25" />
              <p className="mt-8 font-mono text-5xl tabular-nums tracking-[0.18em] text-ink sm:text-7xl">
                {String(count).padStart(2, "0")}
              </p>
            </div>
            <div className="mt-[27px] h-px bg-ink/25" />
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-1 gap-4 border-t border-ink/15 px-5 py-5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-muted sm:grid-cols-3 sm:gap-6 sm:px-10 sm:tracking-[0.22em]">
        <div>
          <p>Destination</p>
          <p className="mt-1 text-ink">Production</p>
        </div>
        <div className="sm:text-center">
          <p>Time on the board</p>
          <p className="mt-1 tabular-nums text-ink">{clock}</p>
        </div>
        <div className="sm:text-right">
          <p>Welcome to</p>
          <p className="mt-1 text-ink">The new digital era</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-10">
        <LetterBloat
          text="AZRA"
          className="font-display text-base font-semibold tracking-[0.4em] sm:text-lg"
        />
        <button
          type="button"
          onClick={onDismiss}
          className="min-h-11 font-mono text-[10px] uppercase tracking-[0.24em] text-ink underline-offset-4 hover:underline"
        >
          Board the vessel
        </button>
      </div>
    </div>
  );
}
