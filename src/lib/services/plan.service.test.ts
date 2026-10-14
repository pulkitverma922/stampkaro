import { describe, expect, it } from "vitest";
import { isBusinessPlanActive } from "@/lib/services/plan-policy";

const timestamp = (value: number) => ({ toMillis: () => value });
describe("isBusinessPlanActive", () => {
  it("accepts an active trial", () => expect(isBusinessPlanActive({ plan: "trial", trialEndsAt: timestamp(2000) }, 1000)).toBe(true));
  it("rejects an expired trial", () => expect(isBusinessPlanActive({ plan: "trial", trialEndsAt: timestamp(500) }, 1000)).toBe(false));
  it("accepts enterprise without expiry", () => expect(isBusinessPlanActive({ plan: "enterprise" }, 1000)).toBe(true));
});
