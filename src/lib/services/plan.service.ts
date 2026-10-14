import "server-only";
import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import type { Plan } from "@/types/models";
import { ApiError } from "@/lib/utils/api";
import { isBusinessPlanActive } from "@/lib/services/plan-policy";

export { isBusinessPlanActive };

const planRank: Record<Plan, number> = { trial: 0, basic: 1, growth: 2, pro: 3, enterprise: 4 };

export function requireActivePlan(business: DocumentData) {
  if (!isBusinessPlanActive(business)) throw new ApiError("PLAN_EXPIRED", "Your trial or plan has expired", 403);
}

export function requirePlan(business: DocumentData, minimum: Plan) {
  requireActivePlan(business);
  if (business.plan !== "trial" && planRank[business.plan as Plan] < planRank[minimum]) throw new ApiError("FORBIDDEN", `This feature requires the ${minimum} plan or higher`, 403);
}

export function planExpiry(days = 30) {
  return Timestamp.fromMillis(Date.now() + days * 24 * 60 * 60 * 1000);
}
