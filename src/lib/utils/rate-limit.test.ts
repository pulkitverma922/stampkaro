import { describe, expect, it } from "vitest";
import { enforceRateLimit } from "@/lib/utils/rate-limit";

describe("enforceRateLimit", () => {
  it("allows requests under the limit and rejects excess", () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    enforceRateLimit(key, { limit: 2, windowMs: 60_000 });
    enforceRateLimit(key, { limit: 2, windowMs: 60_000 });
    expect(() => enforceRateLimit(key, { limit: 2, windowMs: 60_000 })).toThrow("Too many requests");
  });
});
