import { describe, it, expect, vi } from "vitest";
import { createClient, HttpRequestError } from "./index";

type MockResponse = {
  ok: boolean;
  status: number;
  headers: { get(name: string): string | null };
  json(): Promise<unknown>;
  text(): Promise<string>;
};

describe("smart-fetch-client", () => {
  it("performs a basic GET request and parses JSON", async () => {
    const response: MockResponse = {
      ok: true,
      status: 200,
      headers: {
        get(name: string) {
          if (name.toLowerCase() === "content-type") {
            return "application/json";
          }
          return null;
        }
      },
      async json() {
        return { ok: true };
      },
      async text() {
        return "";
      }
    };

    const fetchMock = vi.fn<[], Promise<MockResponse>>(() =>
      Promise.resolve(response)
    );

    const client = createClient({
      baseUrl: "https://api.example.com",
      fetch: fetchMock as any
    });

    const result = await client.get<{ ok: boolean }>("/test");

    expect(result.status).toBe(200);
    expect(result.data.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries on server errors", async () => {
    const responses: MockResponse[] = [
      {
        ok: false,
        status: 500,
        headers: {
          get() {
            return "application/json";
          }
        },
        async json() {
          return { error: true };
        },
        async text() {
          return "{\"error\":true}";
        }
      },
      {
        ok: true,
        status: 200,
        headers: {
          get() {
            return "application/json";
          }
        },
        async json() {
          return { ok: true };
        },
        async text() {
          return "{\"ok\":true}";
        }
      }
    ];

    const fetchMock = vi.fn<[], Promise<MockResponse>>(() =>
      Promise.resolve(responses.shift() as MockResponse)
    );

    const client = createClient({
      baseUrl: "https://api.example.com",
      fetch: fetchMock as any,
      retries: 1,
      retryDelayMs: () => 0
    });

    const result = await client.get<{ ok: boolean }>("/retry");

    expect(result.status).toBe(200);
    expect(result.data.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws HttpRequestError on client error", async () => {
    const response: MockResponse = {
      ok: false,
      status: 400,
      headers: {
        get() {
          return "application/json";
        }
      },
      async json() {
        return { error: true };
      },
      async text() {
        return "{\"error\":true}";
      }
    };

    const fetchMock = vi.fn<[], Promise<MockResponse>>(() =>
      Promise.resolve(response)
    );

    const client = createClient({
      baseUrl: "https://api.example.com",
      fetch: fetchMock as any,
      retries: 0
    });

    await expect(() => client.get("/error")).rejects.toBeInstanceOf(
      HttpRequestError
    );
  });
});
