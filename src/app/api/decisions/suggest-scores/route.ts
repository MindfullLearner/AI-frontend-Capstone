
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockLimit, mockGenerateObject, mockHeaders } = vi.hoisted(() => ({
  mockLimit: vi.fn(),
  mockGenerateObject: vi.fn(),
  mockHeaders: vi.fn(),
}));

vi.mock("@/lib/ai/rate-limit", () => ({
  aiRateLimit: { limit: mockLimit },
}));

vi.mock("next/headers", () => ({
  headers: mockHeaders,
}));

vi.mock("ai", () => ({
  generateObject: mockGenerateObject,
}));

import { POST } from "./route";

describe("POST /api/decisions/suggest-scores rate limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockHeaders.mockResolvedValue(
      new Headers({ "x-real-ip": "203.0.113.5" })
    );
  });

  it("returns 429 and skips AI generation when the limit is exceeded", async () => {
    mockLimit.mockResolvedValue({
      success: false,
      reset: Date.now() + 30_000,
    });

    const response = await POST(
        new Request("http://localhost/api/decisions/suggest-scores",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
    expect(mockGenerateObject).not.toHaveBeenCalled();
  });
  
    it("returns 503 when the client IP is missing", async () => {
    mockHeaders.mockResolvedValue(new Headers());

    const response = await POST(
        new Request("http://localhost/api/decisions/suggest-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        })
    );

    expect(response.status).toBe(503);
    expect(mockLimit).not.toHaveBeenCalled();
    expect(mockGenerateObject).not.toHaveBeenCalled();
    });

    it("returns 503 when the rate-limiting service fails", async () => {
    mockLimit.mockRejectedValue(new Error("Redis unavailable"));

    const response = await POST(
        new Request("http://localhost/api/decisions/suggest-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        })
    );

    expect(response.status).toBe(503);
    expect(mockGenerateObject).not.toHaveBeenCalled();
    });

    it("continues to request validation when rate limiting allows the request", async () => {
    mockLimit.mockResolvedValue({
        success: true,
        reset: Date.now() + 60_000,
    });

    const response = await POST(
        new Request("http://localhost/api/decisions/suggest-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        })
    );

    expect(mockLimit).toHaveBeenCalledWith("203.0.113.5");
    expect(response.status).toBe(400);
    expect(mockGenerateObject).not.toHaveBeenCalled();
    });

});
