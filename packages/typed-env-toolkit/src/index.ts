export type EnvIssue = {
  key: string;
  message: string;
};

export class EnvError extends Error {
  issues: EnvIssue[];

  constructor(issues: EnvIssue[]) {
    super("Invalid environment variables");
    this.name = "EnvError";
    this.issues = issues;
  }
}

export interface EnvVarParser<T> {
  parse(raw: string | undefined, key: string): T;
}

export type EnvSchema = Record<string, EnvVarParser<any>>;

export type InferEnv<TSchema extends EnvSchema> = {
  [K in keyof TSchema]: TSchema[K] extends EnvVarParser<infer R> ? R : never;
};

export type DefineEnvOptions = {
  env?: NodeJS.ProcessEnv;
  onError?: (error: EnvError) => never | void;
};

export function defineEnv<TSchema extends EnvSchema>(
  schema: TSchema,
  options: DefineEnvOptions = {}
): InferEnv<TSchema> {
  const env = options.env ?? process.env;
  const issues: EnvIssue[] = [];
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(schema)) {
    const parser = schema[key];
    try {
      result[key] = parser.parse(env[key], key);
    } catch (error) {
      if (error instanceof EnvError) {
        issues.push(...error.issues);
      } else if (error instanceof Error) {
        issues.push({ key, message: error.message });
      } else {
        issues.push({ key, message: String(error) });
      }
    }
  }

  if (issues.length > 0) {
    const error = new EnvError(issues);
    if (options.onError) {
      options.onError(error);
    } else {
      throw error;
    }
  }

  return result as InferEnv<TSchema>;
}

export type StringOptions = {
  default?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  trim?: boolean;
};

export function str(options: StringOptions = {}): EnvVarParser<string> {
  return {
    parse(raw, key) {
      let value = raw ?? options.default;
      if (value == null) {
        throw new Error(`Environment variable ${key} is required`);
      }
      if (options.trim !== false) {
        value = value.trim();
      }
      if (options.minLength != null && value.length < options.minLength) {
        throw new Error(
          `Environment variable ${key} must have length at least ${options.minLength}`
        );
      }
      if (options.maxLength != null && value.length > options.maxLength) {
        throw new Error(
          `Environment variable ${key} must have length at most ${options.maxLength}`
        );
      }
      if (options.pattern && !options.pattern.test(value)) {
        throw new Error(`Environment variable ${key} has invalid format`);
      }
      return value;
    }
  };
}

export type NumberOptions = {
  default?: number;
  min?: number;
  max?: number;
};

export function num(options: NumberOptions = {}): EnvVarParser<number> {
  return {
    parse(raw, key) {
      if (raw == null || raw.trim() === "") {
        if (options.default != null) {
          return options.default;
        }
        throw new Error(`Environment variable ${key} is required`);
      }
      const value = Number(raw);
      if (Number.isNaN(value)) {
        throw new Error(`Environment variable ${key} must be a number`);
      }
      if (options.min != null && value < options.min) {
        throw new Error(
          `Environment variable ${key} must be at least ${options.min}`
        );
      }
      if (options.max != null && value > options.max) {
        throw new Error(
          `Environment variable ${key} must be at most ${options.max}`
        );
      }
      return value;
    }
  };
}

export type BooleanOptions = {
  default?: boolean;
};

const TRUE_VALUES = ["1", "true", "yes", "y", "on"];
const FALSE_VALUES = ["0", "false", "no", "n", "off"];

export function bool(options: BooleanOptions = {}): EnvVarParser<boolean> {
  return {
    parse(raw, key) {
      if (raw == null || raw.trim() === "") {
        if (options.default != null) {
          return options.default;
        }
        throw new Error(`Environment variable ${key} is required`);
      }
      const value = raw.trim().toLowerCase();
      if (TRUE_VALUES.includes(value)) {
        return true;
      }
      if (FALSE_VALUES.includes(value)) {
        return false;
      }
      throw new Error(`Environment variable ${key} must be a boolean`);
    }
  };
}

export function oneOf<T extends string>(
  values: readonly T[]
): EnvVarParser<T> {
  return {
    parse(raw, key) {
      if (raw == null || raw.trim() === "") {
        throw new Error(
          `Environment variable ${key} must be one of: ${values.join(", ")}`
        );
      }
      const value = raw.trim() as T;
      if (!values.includes(value)) {
        throw new Error(
          `Environment variable ${key} must be one of: ${values.join(", ")}`
        );
      }
      return value;
    }
  };
}

export type OptionalOptions<T> = {
  default?: T | null;
};

export function optional<T>(
  inner: EnvVarParser<T>,
  options: OptionalOptions<T> = {}
): EnvVarParser<T | undefined> {
  return {
    parse(raw, key) {
      if (raw == null || raw.trim() === "") {
        if (options.default !== undefined) {
          return options.default === null ? undefined : options.default;
        }
        return undefined;
      }
      return inner.parse(raw, key);
    }
  };
}

export type JsonOptions<T> = {
  default?: T;
};

export function json<T>(options: JsonOptions<T> = {}): EnvVarParser<T> {
  return {
    parse(raw, key) {
      if (raw == null || raw.trim() === "") {
        if ("default" in options) {
          return options.default as T;
        }
        throw new Error(`Environment variable ${key} is required`);
      }
      try {
        return JSON.parse(raw) as T;
      } catch {
        throw new Error(`Environment variable ${key} must be valid JSON`);
      }
    }
  };
}
