export interface ApiErrorPayload {
  code: string;
  message: string;
  status: number;
  details?: unknown;
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(
    code: string,
    message: string,
    status = 500,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON(): ApiErrorPayload {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}

export function createApiError(
  code: string,
  message: string,
  options: { status?: number; details?: unknown } = {}
): ApiError {
  return new ApiError(code, message, options.status ?? 500, options.details);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function normalizeError(
  error: unknown,
  defaultStatus = 500
): ApiError {
  if (isApiError(error)) {
    return error;
  }
  if (error instanceof Error) {
    const anyError = error as Error & {
      status?: number;
      code?: string;
      details?: unknown;
    };
    const status =
      typeof anyError.status === "number" ? anyError.status : defaultStatus;
    const code =
      typeof anyError.code === "string" ? anyError.code : "internal_error";
    return new ApiError(
      code,
      anyError.message || "Internal error",
      status,
      anyError.details
    );
  }
  return new ApiError("internal_error", "Internal error", defaultStatus, {
    value: error
  });
}

export interface ErrorResponseBody {
  error: ApiErrorPayload;
}

export function toErrorResponse(
  error: unknown,
  defaultStatus = 500
): { status: number; body: ErrorResponseBody } {
  const apiError = normalizeError(error, defaultStatus);
  return {
    status: apiError.status,
    body: { error: apiError.toJSON() }
  };
}

export type ExpressErrorHandler = (
  err: unknown,
  req: any,
  res: any,
  next: any
) => void;

export type ExpressMiddlewareOptions = {
  log?: (error: ApiError, req: any) => void;
  defaultStatus?: number;
};

export function createExpressErrorMiddleware(
  options: ExpressMiddlewareOptions = {}
): ExpressErrorHandler {
  return (err: unknown, req: any, res: any, next: any) => {
    const apiError = normalizeError(err, options.defaultStatus ?? 500);
    if (options.log) {
      options.log(apiError, req);
    }
    if (
      res &&
      typeof res.status === "function" &&
      typeof res.json === "function"
    ) {
      res.status(apiError.status).json({ error: apiError.toJSON() });
      return;
    }
    next(err);
  };
}
