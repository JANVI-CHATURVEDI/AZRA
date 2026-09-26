const EPOCH = Date.UTC(2024, 0, 1);

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

const pad = (n: number, width = 3): string => String(n).padStart(width, "0");

export function missionClock(now: number = Date.now()): string {
  const ms = Math.max(0, now - EPOCH);
  const days = Math.floor(ms / DAY_MS);
  const hours = Math.floor((ms % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((ms % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((ms % MINUTE_MS) / 1000);

  return `${pad(days)}:${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
}
