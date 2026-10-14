import Razorpay from "razorpay";
import { z } from "zod";
import { withAuth } from "@/lib/firebase/auth-server";
import { adminDb } from "@/lib/firebase/admin";
import { PLANS } from "@/config/plans";
import { ApiError, ok } from "@/lib/utils/api";

const orderSchema = z.object({ bizId: z.string().min(1), planId: z.enum(["basic", "growth", "pro"]) });

export const POST = withAuth(async (req, _ctx, user) => {
  const { bizId, planId } = orderSchema.parse(await req.json());
  const business = await adminDb.doc(`businesses/${bizId}`).get();
  if (!business.exists) throw new ApiError("NOT_FOUND", "Business not found", 404);
  if (business.get("ownerId") !== user.uid && user.role !== "admin") throw new ApiError("FORBIDDEN", "You do not own this business", 403);
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw new ApiError("INTERNAL", "Razorpay is not configured yet", 503);
  const plan = PLANS.find((item) => item.id === planId)!;
  const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  const order = await razorpay.orders.create({ amount: plan.pricePaise, currency: "INR", receipt: `${bizId.slice(0, 20)}-${Date.now()}`, notes: { bizId, planId } });
  return ok({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID, planName: plan.name });
}, { roles: ["owner"] });
