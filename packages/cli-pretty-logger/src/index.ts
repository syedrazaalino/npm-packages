export type LogLevel = "debug" | "info" | "warn" | "error" | "success";

export interface LoggerOptions {
  level?: LogLevel;
  useColors?: boolean;
}

const LEVEL_ORDER: LogLevel[] = ["debug", "info", "success", "warn", "error"];

function levelEnabled(current: LogLevel, requested: LogLevel): boolean {
  return LEVEL_ORDER.indexOf(requested) >= LEVEL_ORDER.indexOf(current);
}

function supportsColor(): boolean {
  if (typeof process === "undefined") {
    return false;
  }
  return !!process.stdout.isTTY;
}

function color(code: number, text: string): string {
  return `\u001b[${code}m${text}\u001b[0m`;
}

function formatLevel(level: LogLevel): string {
  switch (level) {
    case "debug":
      return "DBG";
    case "info":
      return "INF";
    case "warn":
      return "WRN";
    case "error":
      return "ERR";
    case "success":
      return "OK";
  }
}

function colorize(level: LogLevel, message: string, enabled: boolean): string {
  if (!enabled) {
    return message;
  }
  switch (level) {
    case "debug":
      return color(36, message);
    case "info":
      return color(34, message);
    case "success":
      return color(32, message);
    case "warn":
      return color(33, message);
    case "error":
      return color(31, message);
    default:
      return message;
  }
}

export interface Logger {
  log(level: LogLevel, message: string, ...meta: unknown[]): void;
  debug(message: string, ...meta: unknown[]): void;
  info(message: string, ...meta: unknown[]): void;
  success(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
}

export function createLogger(options: LoggerOptions = {}): Logger {
  const level = options.level ?? "info";
  const useColors = options.useColors ?? supportsColor();

  function log(levelToLog: LogLevel, message: string, ...meta: unknown[]): void {
    if (!levelEnabled(level, levelToLog)) {
      return;
    }
    const prefix = formatLevel(levelToLog);
    const line = colorize(levelToLog, `[${prefix}] ${message}`, useColors);
    if (levelToLog === "error") {
      // eslint-disable-next-line no-console
      console.error(line, ...meta);
    } else {
      // eslint-disable-next-line no-console
      console.log(line, ...meta);
    }
  }

  return {
    log,
    debug: (message, ...meta) => log("debug", message, ...meta),
    info: (message, ...meta) => log("info", message, ...meta),
    success: (message, ...meta) => log("success", message, ...meta),
    warn: (message, ...meta) => log("warn", message, ...meta),
    error: (message, ...meta) => log("error", message, ...meta)
  };
}
