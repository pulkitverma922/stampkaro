import type { Timestamp } from "firebase/firestore";
// Mirror of docs/DATA_MODEL.md — keep in sync (/sync-model).

export type Role = "customer" | "owner" | "staff" | "admin";
export type Plan = "trial" | "basic" | "growth" | "pro" | "enterprise";
export type BusinessCategory = "cafe" | "salon" | "gym" | "restaurant" | "retail" | "other";

export interface UserDoc {
  uid: string; email: string; displayName: string; photoURL?: string; phone?: string;
  role: Role; ownedBusinessIds: string[]; staffBusinessIds?: string[]; createdAt: Timestamp;
}

export interface Business {
  id: string; name: string; slug: string; category: BusinessCategory;
  logoUrl?: string; brandColor: string; ownerId: string;
  plan: Plan; maxBranches: number; trialEndsAt: Timestamp; planExpiresAt?: Timestamp;
  reward: { title: string; requiredStamps: number; description?: string };
  rules: { cooldownHours: number; maxScansPerDay: number; gpsRequired: boolean; radiusMeters: number };
  scratchConfig: { enabled: boolean; probability: number; prizes: { label: string; weight: number }[] };
  stats: { totalScans: number; totalCustomers: number; rewardsRedeemed: number; activeCards: number };
  createdAt: Timestamp; updatedAt: Timestamp;
}

export interface Branch { id: string; name: string; address: string; lat: number; lng: number; isActive: boolean; createdAt: Timestamp }
export interface QrCode { id: string; bizId: string; active: boolean; createdAt: Timestamp }

export interface Card {
  id: string; customerId: string; bizId: string; customerName: string;
  businessName: string; businessLogo?: string;
  stamps: number; requiredStamps: number; completedCount: number;
  status: "active" | "rewardReady"; lastScanAt: Timestamp; createdAt: Timestamp;
}

export interface Scan { id: string; customerId: string; bizId: string; dayKey: string; branchId?: string; lat?: number; lng?: number; distanceM?: number; createdAt: Timestamp }

export interface Redemption {
  id: string; cardId: string; customerId: string; bizId: string; code: string;
  status: "pending" | "confirmed" | "expired"; expiresAt: Timestamp; confirmedBy?: string; createdAt: Timestamp;
}

export interface ScratchCard { id: string; customerId: string; bizId: string; revealed: boolean; prizeLabel: string | null; revealedAt?: Timestamp; createdAt: Timestamp }
export interface DailyStats { scans: number; newCustomers: number; rewardsRedeemed: number; byBranch: Record<string, number> }
export interface MenuCategory { id: string; name: string; order: number }
export interface MenuItem { id: string; categoryId: string; name: string; description?: string; pricePaise: number; isVeg: boolean; imageUrl?: string; available: boolean; order: number }
