import { describe, it, expect, vi } from "vitest";
import { every, parseInterval } from "./index";

describe("parseInterval", () => {
  it("parses numeric values", () => {
    expect(parseInterval(1000)).toBe(1000);
  });

  it("parses string values with units", () => {
    expect(parseInterval("1s")).toBe(1000);
    expect(parseInterval("2m")).toBe(120000);
    expect(parseInterval("1h")).toBe(3600000);
  });
});

describe("every", () => {
  it("schedules a repeating job", async () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const job = every("1s", fn);

    // Advance time and run all timers
    await vi.advanceTimersByTimeAsync(3000);

    expect(fn).toHaveBeenCalledTimes(3);

    job.cancel();
    vi.useRealTimers();
  });
});
