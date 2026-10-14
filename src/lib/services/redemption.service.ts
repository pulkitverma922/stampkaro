import "server-only";
import { randomInt } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { dayKey } from "@/lib/utils/dates";
import { ApiError } from "@/lib/utils/api";
import { REDEMPTION_TTL_MIN } from "@/config/plans";

export async function createRedemption(uid: string, cardId: string) {
  const cardRef = adminDb.doc(`cards/${cardId}`);
  const redemptionRef = adminDb.collection("redemptions").doc();
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(now.toMillis() + REDEMPTION_TTL_MIN * 60 * 1000);
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  return adminDb.runTransaction(async (transaction) => {
    const cardSnapshot = await transaction.get(cardRef);
    if (!cardSnapshot.exists) throw new ApiError("NOT_FOUND", "Loyalty card not found", 404);
    const card = cardSnapshot.data()!;
    if (card.customerId !== uid) throw new ApiError("FORBIDDEN", "This card does not belong to you", 403);
    if (card.status !== "rewardReady") throw new ApiError("FORBIDDEN", "Your reward is not ready yet", 409);
    const pending = await transaction.get(adminDb.collection("redemptions").where("cardId", "==", cardId).where("status", "==", "pending").limit(1));
    if (!pending.empty) {
      const existing = pending.docs[0]!;
      if (existing.get("expiresAt").toMillis() > now.toMillis()) return { redemptionId: existing.id, code: existing.get("code") as string, expiresAt: existing.get("expiresAt").toDate().toISOString() };
      transaction.update(existing.ref, { status: "expired" });
    }
    transaction.create(redemptionRef, { cardId, customerId: uid, customerName: card.customerName, bizId: card.bizId, businessName: card.businessName, code, status: "pending", expiresAt, createdAt: now });
    return { redemptionId: redemptionRef.id, code, expiresAt: expiresAt.toDate().toISOString() };
  });
}

export async function confirmRedemption(input: { uid: string; role: string; redemptionId?: string; bizId?: string; code?: string }) {
  let redemptionRef = input.redemptionId ? adminDb.doc(`redemptions/${input.redemptionId}`) : undefined;
  if (!redemptionRef && input.bizId && input.code) {
    const match = await adminDb.collection("redemptions").where("bizId", "==", input.bizId).where("code", "==", input.code).where("status", "==", "pending").limit(1).get();
    if (match.empty) throw new ApiError("NOT_FOUND", "Redemption code not found", 404);
    redemptionRef = match.docs[0]!.ref;
  }
  if (!redemptionRef) throw new ApiError("VALIDATION", "Redemption details are required", 422);
  return adminDb.runTransaction(async (transaction) => {
    const redemptionSnapshot = await transaction.get(redemptionRef!);
    if (!redemptionSnapshot.exists) throw new ApiError("NOT_FOUND", "Redemption not found", 404);
    const redemption = redemptionSnapshot.data()!;
    const businessRef = adminDb.doc(`businesses/${redemption.bizId}`);
    const [businessSnapshot, staffSnapshot, cardSnapshot] = await Promise.all([transaction.get(businessRef), transaction.get(businessRef.collection("staff").doc(input.uid)), transaction.get(adminDb.doc(`cards/${redemption.cardId}`))]);
    if (input.role !== "admin" && businessSnapshot.get("ownerId") !== input.uid && !staffSnapshot.exists) throw new ApiError("FORBIDDEN", "You cannot confirm this reward", 403);
    if (redemption.status !== "pending") throw new ApiError("ALREADY_REDEEMED", "This reward is no longer pending", 409);
    if (redemption.expiresAt.toMillis() <= Date.now()) { transaction.update(redemptionRef!, { status: "expired" }); throw new ApiError("CODE_EXPIRED", "This code has expired", 410); }
    if (!cardSnapshot.exists) throw new ApiError("NOT_FOUND", "Loyalty card not found", 404);
    transaction.update(redemptionRef!, { status: "confirmed", confirmedBy: input.uid, confirmedAt: Timestamp.now() });
    transaction.update(cardSnapshot.ref, { stamps: 0, status: "active", completedCount: FieldValue.increment(1) });
    transaction.set(businessRef, { "stats.rewardsRedeemed": FieldValue.increment(1) }, { merge: true });
    transaction.set(businessRef.collection("dailyStats").doc(dayKey()), { rewardsRedeemed: FieldValue.increment(1), scans: FieldValue.increment(0), newCustomers: FieldValue.increment(0) }, { merge: true });
    return { card: { id: cardSnapshot.id, ...cardSnapshot.data(), stamps: 0, status: "active", completedCount: (cardSnapshot.get("completedCount") ?? 0) + 1 } };
  });
}
