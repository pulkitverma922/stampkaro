import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/utils/api";
import { evaluateScan } from "@/lib/services/scan-policy";

const base = { duplicate: false, status: "active" as const, stamps: 2, requiredStamps: 4, cooldownHours: 6, scansToday: 0, maxScansPerDay: 2, nowMs: 1_000_000 };

describe("evaluateScan", () => {
  it("adds a stamp", () => expect(evaluateScan(base)).toMatchObject({ addStamp: true, nextStamps: 3, rewardUnlocked: false }));
  it("unlocks a reward", () => expect(evaluateScan({ ...base, stamps: 3 })).toMatchObject({ nextStamps: 4, rewardUnlocked: true }));
  it("returns an idempotent duplicate", () => expect(evaluateScan({ ...base, duplicate: true })).toMatchObject({ addStamp: false, duplicate: true, nextStamps: 2 }));
  it("does not stamp a reward-ready card", () => expect(evaluateScan({ ...base, status: "rewardReady" })).toMatchObject({ addStamp: false, nextStamps: 2 }));
  it("enforces cooldown", () => expect(() => evaluateScan({ ...base, lastScanAtMs: base.nowMs - 60_000 })).toThrowError(ApiError));
  it("enforces the daily limit", () => expect(() => evaluateScan({ ...base, scansToday: 2 })).toThrowError(ApiError));
});
