import "server-only";
import { randomInt } from "node:crypto";
import { Timestamp, type DocumentData, type Transaction } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { ApiError } from "@/lib/utils/api";
import { chooseWeightedPrize } from "@/lib/services/scratch-policy";

export function maybeCreateScratchCard(transaction: Transaction, input: { customerId: string; bizId: string; businessName: string; config?: DocumentData; now: Timestamp }) {
  const config = input.config;
  if (!config?.enabled || !config.prizes?.length || Math.random() >= config.probability) return undefined;
  const scratchRef = adminDb.collection("scratchCards").doc();
  const totalWeight = config.prizes.reduce((sum: number, prize: { weight: number }) => sum + prize.weight, 0);
  const prize = chooseWeightedPrize(config.prizes, randomInt(0, Math.max(1, Math.ceil(totalWeight * 1000))) / 1000);
  transaction.create(scratchRef, { customerId: input.customerId, bizId: input.bizId, businessName: input.businessName, revealed: false, prizeLabel: null, createdAt: input.now });
  transaction.create(scratchRef.collection("secret").doc("prize"), { label: prize });
  return { id: scratchRef.id };
}

export async function revealScratchCard(uid: string, scratchCardId: string) {
  const scratchRef = adminDb.doc(`scratchCards/${scratchCardId}`);
  return adminDb.runTransaction(async (transaction) => {
    const [scratch, secret] = await Promise.all([transaction.get(scratchRef), transaction.get(scratchRef.collection("secret").doc("prize"))]);
    if (!scratch.exists || !secret.exists) throw new ApiError("NOT_FOUND", "Scratch card not found", 404);
    if (scratch.get("customerId") !== uid) throw new ApiError("FORBIDDEN", "This scratch card does not belong to you", 403);
    if (scratch.get("revealed")) return { prizeLabel: scratch.get("prizeLabel") as string | null };
    const prizeLabel = (secret.get("label") as string | null) ?? null;
    transaction.update(scratchRef, { revealed: true, prizeLabel, revealedAt: Timestamp.now() });
    return { prizeLabel };
  });
}
