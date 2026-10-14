import { withAuth } from "@/lib/firebase/auth-server";
import { scanSchema } from "@/lib/validation/schemas";
import { ok } from "@/lib/utils/api";
import { adminAuth } from "@/lib/firebase/admin";
import { addStamp } from "@/lib/services/scan.service";
import { enforceRateLimit } from "@/lib/utils/rate-limit";

export const POST = withAuth(async (req, _ctx, user) => {
  enforceRateLimit(`scan:${user.uid}`, { limit: 20, windowMs: 60_000 });
  const body = scanSchema.parse(await req.json());
  const authUser = await adminAuth.getUser(user.uid);
  const result = await addStamp({ uid: user.uid, displayName: authUser.displayName ?? "Customer", ...body });
  return ok(result);
}, { roles: ["customer"] });
