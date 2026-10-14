import { FieldValue } from "firebase-admin/firestore";
import { withAuth } from "@/lib/firebase/auth-server";
import { adminDb } from "@/lib/firebase/admin";
import { businessUpdateSchema } from "@/lib/validation/schemas";
import { ApiError, ok } from "@/lib/utils/api";

export const PATCH = withAuth(async (req, { params }: { params: Promise<{ bizId: string }> }, user) => {
  const { bizId } = await params;
  const body = businessUpdateSchema.parse(await req.json());
  const businessRef = adminDb.doc(`businesses/${bizId}`);
  const business = await businessRef.get();
  if (!business.exists) throw new ApiError("NOT_FOUND", "Business not found", 404);
  if (business.get("ownerId") !== user.uid && user.role !== "admin") throw new ApiError("FORBIDDEN", "You do not own this business", 403);
  await businessRef.update({ ...body, updatedAt: FieldValue.serverTimestamp() });
  return ok({ business: { id: business.id, ...business.data(), ...body } });
}, { roles: ["owner"] });
