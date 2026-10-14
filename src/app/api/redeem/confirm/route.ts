import { withAuth } from "@/lib/firebase/auth-server";
import { confirmRedeemSchema } from "@/lib/validation/schemas";
import { confirmRedemption } from "@/lib/services/redemption.service";
import { ok } from "@/lib/utils/api";

export const POST = withAuth(async (req, _ctx, user) => {
  const body = confirmRedeemSchema.parse(await req.json());
  return ok(await confirmRedemption({ uid: user.uid, role: user.role, ...body }));
}, { roles: ["owner", "staff"] });
