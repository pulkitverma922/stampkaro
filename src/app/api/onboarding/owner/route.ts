import { randomBytes } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { withAuth } from "@/lib/firebase/auth-server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { ownerOnboardingSchema } from "@/lib/validation/schemas";
import { DEFAULT_RULES, TRIAL_DAYS } from "@/config/plans";
import { ApiError, ok } from "@/lib/utils/api";

function createSlug(value: string) {
  const base = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "business"}-${randomBytes(2).toString("hex")}`;
}

export const POST = withAuth(async (req, _ctx, user) => {
  const body = ownerOnboardingSchema.parse(await req.json());
  const userRef = adminDb.doc(`users/${user.uid}`);
  const existingUser = await userRef.get();
  if (existingUser.exists && existingUser.get("role") === "owner") {
    throw new ApiError("FORBIDDEN", "Owner onboarding is already complete", 409);
  }

  const authUser = await adminAuth.getUser(user.uid);
  const bizRef = adminDb.collection("businesses").doc();
  const branchRef = bizRef.collection("branches").doc();
  const qrId = randomBytes(6).toString("base64url").slice(0, 8);
  const qrRef = adminDb.doc(`qrCodes/${qrId}`);
  const slug = createSlug(body.businessName);
  const slugRef = adminDb.doc(`slugs/${slug}`);
  const now = Timestamp.now();
  const trialEndsAt = Timestamp.fromMillis(now.toMillis() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  await adminDb.runTransaction(async (transaction) => {
    transaction.create(bizRef, {
      name: body.businessName,
      slug,
      category: body.category,
      logoUrl: "",
      brandColor: "#FF7A00",
      ownerId: user.uid,
      plan: "trial",
      maxBranches: 1,
      trialEndsAt,
      reward: { title: body.rewardTitle, requiredStamps: body.requiredStamps },
      rules: DEFAULT_RULES,
      scratchConfig: { enabled: false, probability: 0, prizes: [] },
      stats: { totalScans: 0, totalCustomers: 0, rewardsRedeemed: 0, activeCards: 0 },
      createdAt: now,
      updatedAt: now,
    });
    transaction.create(branchRef, {
      name: body.branch.name,
      address: body.branch.address,
      ...(body.branch.lat !== undefined ? { lat: body.branch.lat } : {}),
      ...(body.branch.lng !== undefined ? { lng: body.branch.lng } : {}),
      isActive: true,
      createdAt: now,
    });
    transaction.create(qrRef, { bizId: bizRef.id, active: true, createdAt: now });
    transaction.create(slugRef, { bizId: bizRef.id });
    transaction.set(userRef, {
      uid: user.uid,
      email: authUser.email ?? "",
      displayName: authUser.displayName ?? body.businessName,
      photoURL: authUser.photoURL ?? null,
      role: "owner",
      ownedBusinessIds: FieldValue.arrayUnion(bizRef.id),
      createdAt: existingUser.exists ? existingUser.get("createdAt") : now,
    }, { merge: true });
  });

  await adminAuth.setCustomUserClaims(user.uid, { ...authUser.customClaims, role: "owner" });
  return ok({ bizId: bizRef.id, qrId }, 201);
});
