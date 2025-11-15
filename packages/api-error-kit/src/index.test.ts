import { describe, it, expect, vi } from "vitest";
import {
  ApiError,
  createApiError,
  isApiError,
  normalizeError,
  toErrorResponse,
  createExpressErrorMiddleware
} from "./index";

describe("ApiError", () => {
  it("serializes to JSON", () => {
    const error = new ApiError("not_found", "Not found", 404, {
      resource: "item"
    });
    const json = error.toJSON();

    expect(json.code).toBe("not_found");
    expect(json.status).toBe(404);
    expect(json.details).toEqual({ resource: "item" });
  });
});

describe("createApiError and normalizeError", () => {
  it("creates an ApiError", () => {
    const error = createApiError("bad_request", "Bad request", { status: 400 });
    expect(isApiError(error)).toBe(true);
    expect(error.status).toBe(400);
  });

  it("normalizes plain Error", () => {
    const original = new Error("Oops");
    (original as any).status = 403;
    (original as any).code = "forbidden";

    const normalized = normalizeError(original);
    expect(normalized.status).toBe(403);
    expect(normalized.code).toBe("forbidden");
  });

  it("normalizes non-error value", () => {
    const normalized = normalizeError({ message: "x" }, 500);
    expect(normalized.status).toBe(500);
    expect(normalized.code).toBe("internal_error");
  });
});

describe("toErrorResponse", () => {
  it("wraps ApiError into response shape", () => {
    const error = createApiError("bad_request", "Bad request", { status: 400 });
    const { status, body } = toErrorResponse(error);

    expect(status).toBe(400);
    expect(body.error.code).toBe("bad_request");
  });
});

describe("createExpressErrorMiddleware", () => {
  it("sends JSON response for ApiError", () => {
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const res = { status, json };
    const next = vi.fn();

    const middleware = createExpressErrorMiddleware();
    const error = createApiError("bad_request", "Bad request", { status: 400 });

    middleware(error, {}, res as any, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: error.toJSON() });
    expect(next).not.toHaveBeenCalled();
  });

  it("delegates to next when response object is invalid", () => {
    const res = {};
    const next = vi.fn();
    const middleware = createExpressErrorMiddleware();
    const error = new Error("Oops");

    middleware(error, {}, res as any, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
