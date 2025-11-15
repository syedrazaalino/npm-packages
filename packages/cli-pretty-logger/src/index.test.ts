import { describe, it, expect, vi } from "vitest";
import { createLogger } from "./index";

describe("cli-pretty-logger", () => {
  it("logs at or above the configured level", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const logger = createLogger({ level: "info", useColors: false });

    logger.debug("debug");
    logger.info("info");
    logger.error("error");

    expect(logSpy).toHaveBeenCalledTimes(1);

    logSpy.mockRestore();
  });
});
