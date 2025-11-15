export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  query?: QueryParams;
  body?: unknown;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: (attempt: number) => number;
  parseJson?: boolean;
}

export interface SmartFetchClientOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: (attempt: number) => number;
}

export interface SmartFetchResponse<T = unknown> {
  status: number;
  headers: Headers;
  data: T;
  raw: Response;
}

export class HttpRequestError extends Error {
  status?: number;
  data?: unknown;
  response?: Response;

  constructor(
    message: string,
    options: { status?: number; data?: unknown; response?: Response } = {}
  ) {
    super(message);
    this.name = "HttpRequestError";
    this.status = options.status;
    this.data = options.data;
    this.response = options.response;
  }
}

export interface SmartFetchClient {
  request<T = unknown>(
    path: string,
    options?: RequestOptions
  ): Promise<SmartFetchResponse<T>>;
  get<T = unknown>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<SmartFetchResponse<T>>;
  post<T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<SmartFetchResponse<T>>;
  put<T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<SmartFetchResponse<T>>;
  patch<T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<SmartFetchResponse<T>>;
  delete<T = unknown>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">
  ): Promise<SmartFetchResponse<T>>;
}

function buildUrl(
  baseUrl: string | undefined,
  path: string,
  query?: QueryParams
): string {
  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute
    ? new URL(path)
    : new URL(path, baseUrl ?? "http://localhost");

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

function defaultRetryDelay(attempt: number): number {
  const base = 200;
  const factor = 2 ** (attempt - 1);
  const jitter = Math.floor(Math.random() * 100);
  return base * factor + jitter;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function createClient(
  options: SmartFetchClientOptions = {}
): SmartFetchClient {
  let fetchImpl: typeof fetch | undefined =
    options.fetch ?? (globalThis.fetch as typeof fetch | undefined);
  if (!fetchImpl) {
    throw new Error(
      "No fetch implementation available. Provide a custom fetch implementation."
    );
  }
  const fetchFn: typeof fetch = fetchImpl;

  const defaultTimeoutMs = options.timeoutMs ?? 10000;
  const defaultRetries = options.retries ?? 2;
  const retryDelayFn = options.retryDelayMs ?? defaultRetryDelay;

  async function doRequest<T>(
    path: string,
    reqOptions: RequestOptions = {}
  ): Promise<SmartFetchResponse<T>> {
    const url = buildUrl(options.baseUrl, path, reqOptions.query);
    const timeoutMs = reqOptions.timeoutMs ?? defaultTimeoutMs;
    const retries = reqOptions.retries ?? defaultRetries;
    const method = reqOptions.method ?? "GET";
    const headers: Record<string, string> = { ...(reqOptions.headers ?? {}) };

    let body: BodyInit | undefined;
    if (reqOptions.body !== undefined && reqOptions.body !== null) {
      const value = reqOptions.body;
      if (
        typeof value === "string" ||
        value instanceof Blob ||
        value instanceof FormData ||
        value instanceof URLSearchParams
      ) {
        body = value as BodyInit;
      } else {
        body = JSON.stringify(value);
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
      }
    }

    let attempt = 0;
    let lastError: unknown;

    while (attempt <= retries) {
      attempt += 1;
      const controller =
        typeof AbortController !== "undefined" ? new AbortController() : undefined;
      const timeoutId = controller
        ? setTimeout(() => controller.abort(), timeoutMs)
        : undefined;

      try {
        const response = await fetchFn(url, {
          method,
          headers,
          body,
          signal: controller?.signal
        } as RequestInit);

        if (timeoutId != null) {
          clearTimeout(timeoutId);
        }

        const parseJson = reqOptions.parseJson !== false;
        let data: any;
        if (parseJson) {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            data = await response.json();
          } else {
            const text = await response.text();
            try {
              data = JSON.parse(text);
            } catch {
              data = text;
            }
          }
        } else {
          data = await response.text();
        }

        if (!response.ok) {
          if (attempt <= retries && (response.status >= 500 || response.status === 429)) {
            lastError = new HttpRequestError("HTTP error", {
              status: response.status,
              data,
              response
            });
            await sleep(retryDelayFn(attempt));
            continue;
          }
          throw new HttpRequestError("HTTP error", {
            status: response.status,
            data,
            response
          });
        }

        return {
          status: response.status,
          headers: response.headers,
          data,
          raw: response
        };
      } catch (error) {
        if (timeoutId != null) {
          clearTimeout(timeoutId);
        }
        lastError = error;
        const isAbortError =
          error instanceof Error && error.name === "AbortError";
        if (attempt <= retries && isAbortError) {
          await sleep(retryDelayFn(attempt));
          continue;
        }
        throw error;
      }
    }

    if (lastError instanceof Error) {
      throw lastError;
    }
    throw new Error("Request failed");
  }

  return {
    request: doRequest,
    get: (path, options) => doRequest(path, { ...options, method: "GET" }),
    post: (path, body, options) =>
      doRequest(path, { ...(options ?? {}), method: "POST", body }),
    put: (path, body, options) =>
      doRequest(path, { ...(options ?? {}), method: "PUT", body }),
    patch: (path, body, options) =>
      doRequest(path, { ...(options ?? {}), method: "PATCH", body }),
    delete: (path, options) =>
      doRequest(path, { ...options, method: "DELETE" })
  };
}

export function isHttpRequestError(error: unknown): error is HttpRequestError {
  return error instanceof HttpRequestError;
}
