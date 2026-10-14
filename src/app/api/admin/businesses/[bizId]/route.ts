import { z } from "zod";
import { withAuth } from "@/lib/firebase/auth-server";
import { adminDb } from "@/lib/firebase/admin";
import { planExpiry } from "@/lib/services/plan.service";
import { PLANS } from "@/config/plans";
import { ApiError, ok } from "@/lib/utils/api";

const schema = z.object({ plan: z.enum(["trial", "basic", "growth", "pro", "enterprise"]) });
export const PATCH = withAuth(async (req, { params }: { params: Promise<{ bizId: string }> }) => {
  const { bizId } = await params; const { plan } = schema.parse(await req.json()); const businessRef = adminDb.doc(`businesses/${bizId}`); if (!(await businessRef.get()).exists) throw new ApiError("NOT_FOUND", "Business not found", 404); const config = PLANS.find((item) => item.id === plan); const maxBranches = plan === "enterprise" ? 999 : plan === "trial" ? 1 : config!.maxBranches; await businessRef.update({ plan, maxBranches, ...(plan === "trial" ? { trialEndsAt: planExpiry(3) } : { planExpiresAt: planExpiry(365) }) }); return ok({ plan, maxBranches });
}, { roles: ["admin"] });
