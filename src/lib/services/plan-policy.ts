export function isBusinessPlanActive(business: { plan?: string; trialEndsAt?: { toMillis(): number }; planExpiresAt?: { toMillis(): number } }, nowMs = Date.now()) {
  if (business.plan === "enterprise") return true;
  const expiry = business.plan === "trial" ? business.trialEndsAt : business.planExpiresAt;
  return (expiry?.toMillis() ?? 0) > nowMs;
}
