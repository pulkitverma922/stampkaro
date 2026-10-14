// Our own pricing — edit freely. Prices in paise.
export const PLANS = [
  { id: "basic", name: "Starter", pricePaise: 99900, maxBranches: 1,
    features: ["1 location", "Digital stamp cards", "Unlimited scans", "Analytics", "Digital menu"] },
  { id: "growth", name: "Growth", pricePaise: 249900, maxBranches: 3, popular: true,
    features: ["Up to 3 locations", "One QR, GPS branch detection", "Scratch cards", "Branch analytics", "Priority support"] },
  { id: "pro", name: "Pro", pricePaise: 499900, maxBranches: 6,
    features: ["Up to 6 locations", "Everything in Growth", "AI menu import", "Staff accounts"] },
] as const;

export const TRIAL_DAYS = 3;
export const DEFAULT_RULES = { cooldownHours: 6, maxScansPerDay: 1, gpsRequired: false, radiusMeters: 200 };
export const REDEMPTION_TTL_MIN = 10;
