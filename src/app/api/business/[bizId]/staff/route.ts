import { Timestamp } from "firebase-admin/firestore";
import { withAuth } from "@/lib/firebase/auth-server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { staffInviteSchema } from "@/lib/validation/schemas";
import { ApiError, ok } from "@/lib/utils/api";

export const POST = withAuth(async (req, { params }: { params: Promise<{ bizId: string }> }, user) => {
  const { bizId } = await params;
  const { email } = staffInviteSchema.parse(await req.json());
  const businessRef = adminDb.doc(`businesses/${bizId}`);
  const business = await businessRef.get();
  if (!business.exists) throw new ApiError("NOT_FOUND", "Business not found", 404);
  if (business.get("ownerId") !== user.uid && user.role !== "admin") throw new ApiError("FORBIDDEN", "You do not own this business", 403);
  let staffUser;
  try { staffUser = await adminAuth.getUserByEmail(email); } catch { throw new ApiError("NOT_FOUND", "Ask this person to create a StampKaro account first", 404); }
  const claims = staffUser.customClaims ?? {};
  if (claims.role === "owner" || claims.role === "admin") throw new ApiError("FORBIDDEN", "This account already has a protected role", 409);
  await Promise.all([
    businessRef.collection("staff").doc(staffUser.uid).set({ email, role: "staff", addedAt: Timestamp.now() }),
    adminDb.doc(`users/${staffUser.uid}`).set({ role: "staff", staffBusinessIds: [bizId] }, { merge: true }),
    adminAuth.setCustomUserClaims(staffUser.uid, { ...claims, role: "staff", staffBusinessIds: [bizId] }),
  ]);
  return ok({ staff: { uid: staffUser.uid, email } }, 201);
}, { roles: ["owner"] });
