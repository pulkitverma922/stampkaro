import { ApiError } from "@/lib/utils/api";

type ScanPolicyInput = {
  duplicate: boolean;
  status?: "active" | "rewardReady";
  stamps: number;
  requiredStamps: number;
  lastScanAtMs?: number;
  cooldownHours: number;
  scansToday: number;
  maxScansPerDay: number;
  nowMs: number;
};

export type ScanDecision = { addStamp: boolean; duplicate: boolean; nextStamps: number; rewardUnlocked: boolean };

export function evaluateScan(input: ScanPolicyInput): ScanDecision {
  if (input.duplicate) return { addStamp: false, duplicate: true, nextStamps: input.stamps, rewardUnlocked: false };
  if (input.status === "rewardReady") return { addStamp: false, duplicate: false, nextStamps: input.stamps, rewardUnlocked: false };
  if (input.lastScanAtMs !== undefined) {
    const nextAllowedAt = input.lastScanAtMs + input.cooldownHours * 60 * 60 * 1000;
    if (nextAllowedAt > input.nowMs) throw new ApiError("COOLDOWN", "Your next stamp is not ready yet", 429, { nextAllowedAt });
  }
  if (input.scansToday >= input.maxScansPerDay) throw new ApiError("DAILY_LIMIT", "You have reached today's stamp limit", 429);
  const nextStamps = input.stamps + 1;
  return { addStamp: true, duplicate: false, nextStamps, rewardUnlocked: nextStamps >= input.requiredStamps };
}
