import "server-only";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { dayKey, hourKey } from "@/lib/utils/dates";
import { nearest } from "@/lib/utils/geo";
import { ApiError } from "@/lib/utils/api";
import { evaluateScan } from "@/lib/services/scan-policy";
import { maybeCreateScratchCard } from "@/lib/services/scratch.service";
import { isBusinessPlanActive } from "@/lib/services/plan.service";

export type AddStampInput = { uid: string; displayName: string; qrId: string; lat?: number; lng?: number };

export async function addStamp(input: AddStampInput) {
  const now = Timestamp.now();
  const qrSnapshot = await adminDb.doc(`qrCodes/${input.qrId}`).get();
  if (!qrSnapshot.exists || !qrSnapshot.get("active")) throw new ApiError("NOT_FOUND", "This QR code is not active", 404);
  const bizId = qrSnapshot.get("bizId") as string;
  const businessRef = adminDb.doc(`businesses/${bizId}`);
  const branchesSnapshot = await businessRef.collection("branches").where("isActive", "==", true).limit(50).get();
  const branches = branchesSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as { lat?: number; lng?: number }) }));
  const locationRequired = branches.length > 1;
  const locatable = branches.filter((branch): branch is typeof branch & { lat: number; lng: number } => typeof branch.lat === "number" && typeof branch.lng === "number");
  let branchId = branches.length === 1 ? branches[0]?.id : undefined;
  let distanceM: number | undefined;
  if (locationRequired && (input.lat === undefined || input.lng === undefined)) throw new ApiError("OUT_OF_RANGE", "Location is required for this business", 422);
  if (input.lat !== undefined && input.lng !== undefined && locatable.length) {
    const closest = nearest({ lat: input.lat, lng: input.lng }, locatable);
    branchId = closest.item.id;
    distanceM = Math.round(closest.distance);
  }

  const cardId = `${input.uid}_${bizId}`;
  const cardRef = adminDb.doc(`cards/${cardId}`);
  const scanRef = adminDb.doc(`scans/${input.uid}_${bizId}_${hourKey(now.toDate())}`);
  const currentDayKey = dayKey(now.toDate());
  const statsRef = businessRef.collection("dailyStats").doc(currentDayKey);
  const dailyScansQuery = adminDb.collection("scans").where("customerId", "==", input.uid).where("bizId", "==", bizId).where("dayKey", "==", currentDayKey).limit(20);

  return adminDb.runTransaction(async (transaction) => {
    const [businessSnapshot, cardSnapshot, duplicateScan, dailyScans] = await Promise.all([transaction.get(businessRef), transaction.get(cardRef), transaction.get(scanRef), transaction.get(dailyScansQuery)]);
    if (!businessSnapshot.exists) throw new ApiError("NOT_FOUND", "Business not found", 404);
    const business = businessSnapshot.data()!;
    if (!isBusinessPlanActive(business, now.toMillis())) throw new ApiError("PLAN_EXPIRED", "This loyalty program is currently paused", 403);
    if ((business.rules?.gpsRequired || locationRequired) && !locatable.length) throw new ApiError("OUT_OF_RANGE", "This business must configure branch coordinates before location-protected scans can be used", 409);
    if (business.rules?.gpsRequired && (input.lat === undefined || input.lng === undefined)) throw new ApiError("OUT_OF_RANGE", "Location access is required", 422);
    if ((business.rules?.gpsRequired || locationRequired) && distanceM !== undefined && distanceM > business.rules.radiusMeters) throw new ApiError("OUT_OF_RANGE", "You are too far from this business", 403, { distanceM });
    const card = cardSnapshot.data();
    const requiredStamps = business.reward.requiredStamps;
    const decision = evaluateScan({ duplicate: duplicateScan.exists, status: card?.status, stamps: card?.stamps ?? 0, requiredStamps, lastScanAtMs: card?.lastScanAt?.toMillis(), cooldownHours: business.rules.cooldownHours, scansToday: dailyScans.size, maxScansPerDay: business.rules.maxScansPerDay, nowMs: now.toMillis() });
    if (!decision.addStamp) return { card: { id: cardId, stamps: decision.nextStamps, requiredStamps: card?.requiredStamps ?? requiredStamps, status: card?.status ?? "active", businessName: card?.businessName ?? business.name }, rewardUnlocked: false, duplicate: decision.duplicate };
    const { nextStamps, rewardUnlocked } = decision;
    const cardData = { customerId: input.uid, bizId, customerName: input.displayName, businessName: business.name, businessLogo: business.logoUrl ?? "", stamps: nextStamps, requiredStamps, completedCount: card?.completedCount ?? 0, status: rewardUnlocked ? "rewardReady" : "active", lastScanAt: now, createdAt: card?.createdAt ?? now };
    transaction.set(cardRef, cardData);
    transaction.create(scanRef, { customerId: input.uid, bizId, dayKey: currentDayKey, ...(branchId ? { branchId } : {}), ...(input.lat !== undefined ? { lat: input.lat, lng: input.lng, distanceM } : {}), createdAt: now });
    transaction.set(businessRef, { "stats.totalScans": FieldValue.increment(1), "stats.totalCustomers": FieldValue.increment(cardSnapshot.exists ? 0 : 1), "stats.activeCards": FieldValue.increment(cardSnapshot.exists ? 0 : 1), updatedAt: now }, { merge: true });
    transaction.set(statsRef, { scans: FieldValue.increment(1), newCustomers: FieldValue.increment(cardSnapshot.exists ? 0 : 1), rewardsRedeemed: FieldValue.increment(0), ...(branchId ? { [`byBranch.${branchId}`]: FieldValue.increment(1) } : {}) }, { merge: true });
    const scratchCard = maybeCreateScratchCard(transaction, { customerId: input.uid, bizId, businessName: business.name, config: business.scratchConfig, now });
    return { card: { id: cardId, stamps: nextStamps, requiredStamps, status: cardData.status, businessName: business.name }, rewardUnlocked, duplicate: false, scratchCard };
  });
}
