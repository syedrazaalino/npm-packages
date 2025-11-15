export type IntervalInput = number | string;

export interface Job {
  cancel(): void;
  isRunning(): boolean;
}

export interface EveryOptions {
  immediate?: boolean;
}

export function parseInterval(input: IntervalInput): number {
  if (typeof input === "number") {
    if (!Number.isFinite(input) || input <= 0) {
      throw new Error("Interval must be a positive finite number");
    }
    return input;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Interval string must not be empty");
  }

  const match = /^(\d+)\s*(ms|s|m|h|d)?$/i.exec(trimmed);
  if (!match) {
    throw new Error(
      "Invalid interval format. Use e.g. '500ms', '2s', '5m', '1h', '1d' or a number."
    );
  }

  const value = Number(match[1]);
  const unit = (match[2] || "ms").toLowerCase();

  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  const multiplier = multipliers[unit];
  if (!multiplier) {
    throw new Error("Unsupported interval unit");
  }

  const result = value * multiplier;
  if (!Number.isFinite(result) || result <= 0) {
    throw new Error("Interval must be positive");
  }

  return result;
}

export function every(
  interval: IntervalInput,
  fn: () => void | Promise<void>,
  options: EveryOptions = {}
): Job {
  const intervalMs = parseInterval(interval);
  let running = false;
  let timer: NodeJS.Timeout | null = null;

  const run = async () => {
    if (running) {
      return;
    }
    running = true;
    try {
      await fn();
    } finally {
      running = false;
    }
  };

  if (options.immediate) {
    void run();
  }

  timer = setInterval(() => {
    void run();
  }, intervalMs);

  return {
    cancel() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    },
    isRunning() {
      return running;
    }
  };
}
