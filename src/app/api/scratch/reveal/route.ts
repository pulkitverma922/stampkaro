import { withAuth } from "@/lib/firebase/auth-server";
import { scratchRevealSchema } from "@/lib/validation/schemas";
import { revealScratchCard } from "@/lib/services/scratch.service";
import { ok } from "@/lib/utils/api";

export const POST = withAuth(async (req, _ctx, user) => {
  const { scratchCardId } = scratchRevealSchema.parse(await req.json());
  return ok(await revealScratchCard(user.uid, scratchCardId));
}, { roles: ["customer"] });
