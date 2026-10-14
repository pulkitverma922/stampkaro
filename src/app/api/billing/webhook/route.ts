import { createHmac, timingSafeEqual } from "node:crypto";
import { adminDb } from "@/lib/firebase/admin";
import { planExpiry } from "@/lib/services/plan.service";
import { ApiError, ok, toErrorResponse } from "@/lib/utils/api";
import { PLANS } from "@/config/plans";

export async function POST(req: Request) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) throw new ApiError("INTERNAL", "Webhook is not configured", 503);
    const body = await req.text(); const supplied = req.headers.get("x-razorpay-signature") ?? ""; const expected = createHmac("sha256", secret).update(body).digest("hex");
    if (supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) throw new ApiError("FORBIDDEN", "Invalid webhook signature", 401);
    const event = JSON.parse(body) as { event?: string; payload?: { payment?: { entity?: { order_id?: string; notes?: { bizId?: string; planId?: string } } } } };
    if (event.event !== "payment.captured") return ok({ ignored: true });
    const payment = event.payload?.payment?.entity; const bizId = payment?.notes?.bizId; const planId = payment?.notes?.planId; const plan = PLANS.find((item) => item.id === planId);
    if (!bizId || !plan) throw new ApiError("VALIDATION", "Missing billing metadata", 422);
    const eventRef = adminDb.doc(`billingEvents/${payment?.order_id}`);
    await adminDb.runTransaction(async (transaction) => { if ((await transaction.get(eventRef)).exists) return; transaction.create(eventRef, { event: event.event, bizId, planId, processedAt: new Date() }); transaction.update(adminDb.doc(`businesses/${bizId}`), { plan: plan.id, maxBranches: plan.maxBranches, planExpiresAt: planExpiry(365) }); });
    return ok({});
  } catch (error) { return toErrorResponse(error); }
}
