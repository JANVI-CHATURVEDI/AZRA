import { describe, expect, it } from "vitest";

import { missionClock } from "./mission-clock";

const EPOCH = Date.UTC(2024, 0, 1);

describe("missionClock", () => {
  it("reads zero at the studio epoch", () => {
    expect(missionClock(EPOCH)).toBe("000:00:00:00");
  });

  it("formats days, hours, minutes and seconds with fixed widths", () => {
    const oneDayOneHourOneMinuteOneSecond = EPOCH + 86_400_000 + 3_600_000 + 60_000 + 1000;

    expect(missionClock(oneDayOneHourOneMinuteOneSecond)).toBe("001:01:01:01");
  });

  it("clamps negative clocks instead of showing minus signs", () => {
    expect(missionClock(EPOCH - 5_000)).toBe("000:00:00:00");
  });

  it("pads the day counter to three digits", () => {
    const fortyTwoDays = EPOCH + 42 * 86_400_000;

    expect(missionClock(fortyTwoDays).startsWith("042:")).toBe(true);
  });

  it("never exceeds two digits for hours, minutes or seconds", () => {
    const justUnderTwoDays = EPOCH + 2 * 86_400_000 - 1000;

    expect(missionClock(justUnderTwoDays)).toBe("001:23:59:59");
  });
});
