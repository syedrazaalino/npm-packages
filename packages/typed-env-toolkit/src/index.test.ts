import { describe, it, expect } from "vitest";
import {
  bool,
  defineEnv,
  EnvError,
  json,
  num,
  oneOf,
  optional,
  str
} from "./index";

describe("defineEnv", () => {
  it("parses required variables", () => {
    const env = defineEnv(
      {
        NODE_ENV: oneOf(["development", "production"] as const),
        PORT: num({ default: 3000 })
      },
      {
        env: {
          NODE_ENV: "production"
        } as NodeJS.ProcessEnv
      }
    );

    expect(env.NODE_ENV).toBe("production");
    expect(env.PORT).toBe(3000);
  });

  it("throws EnvError for invalid variables", () => {
    expect(() =>
      defineEnv({
        PORT: num()
      }, {
        env: {} as NodeJS.ProcessEnv
      })
    ).toThrow(EnvError);
  });

  it("supports optional variables", () => {
    const env = defineEnv(
      {
        DEBUG: optional(bool())
      },
      { env: {} as NodeJS.ProcessEnv }
    );

    expect(env.DEBUG).toBeUndefined();
  });

  it("uses defaults for optional variables", () => {
    const env = defineEnv(
      {
        DEBUG: optional(bool(), { default: true })
      },
      { env: {} as NodeJS.ProcessEnv }
    );

    expect(env.DEBUG).toBe(true);
  });

  it("parses JSON variables", () => {
    const env = defineEnv(
      {
        CONFIG: json<{ featureEnabled: boolean }>()
      },
      {
        env: {
          CONFIG: '{"featureEnabled":true}'
        } as NodeJS.ProcessEnv
      }
    );

    expect(env.CONFIG.featureEnabled).toBe(true);
  });

  it("aggregates multiple issues", () => {
    try {
      defineEnv(
        {
          A: num(),
          B: bool()
        },
        { env: {} as NodeJS.ProcessEnv }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(EnvError);
      if (error instanceof EnvError) {
        expect(error.issues.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
