import { FieldValue } from "firebase-admin/firestore";
import { withAuth } from "@/lib/firebase/auth-server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { customerOnboardingSchema } from "@/lib/validation/schemas";
import { ok } from "@/lib/utils/api";

export const POST = withAuth(async (req, _ctx, user) => {
  const body = customerOnboardingSchema.parse(await req.json());
  const authUser = await adminAuth.getUser(user.uid);
  const userRef = adminDb.doc(`users/${user.uid}`);
  const existing = await userRef.get();

  const userDoc = {
    uid: user.uid,
    email: authUser.email ?? "",
    displayName: body.displayName ?? authUser.displayName ?? "Customer",
    photoURL: authUser.photoURL ?? null,
    ...(body.phone ? { phone: body.phone } : {}),
    role: "customer" as const,
    ownedBusinessIds: [],
    createdAt: existing.exists ? existing.get("createdAt") : FieldValue.serverTimestamp(),
  };

  await userRef.set(userDoc, { merge: true });
  await adminAuth.setCustomUserClaims(user.uid, { ...authUser.customClaims, role: "customer" });

  return ok({ user: { ...userDoc, createdAt: undefined } });
});
