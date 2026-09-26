"use client";

import { useMissionClock } from "@/hooks/use-mission-clock";
import { site } from "@/content/site";

export function Hud() {
  const clock = useMissionClock();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden border-t border-line bg-bg/85 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted backdrop-blur-sm lg:grid lg:grid-cols-3"
    >
      <span>
        Destination
        <span className="ml-3 text-fg">{site.destination}</span>
      </span>
      <span className="text-center tabular-nums" data-no-bloat>
        Time on the board
        <span className="ml-3 text-fg">{clock}</span>
      </span>
      <span className="text-right">
        Studio
        <span className="ml-3 text-fg">{site.name}</span>
      </span>
    </div>
  );
}
