import { withAuth } from "@/lib/firebase/auth-server";
import { redeemSchema } from "@/lib/validation/schemas";
import { createRedemption } from "@/lib/services/redemption.service";
import { ok } from "@/lib/utils/api";
import { enforceRateLimit } from "@/lib/utils/rate-limit";

export const POST = withAuth(async (req, _ctx, user) => {
  enforceRateLimit(`redeem:${user.uid}`, { limit: 10, windowMs: 60_000 });
  const body = redeemSchema.parse(await req.json());
  return ok(await createRedemption(user.uid, body.cardId), 201);
}, { roles: ["customer"] });
