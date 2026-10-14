import { withAuth } from "@/lib/firebase/auth-server";
import { adminDb } from "@/lib/firebase/admin";
import { ok } from "@/lib/utils/api";

export const GET = withAuth(async (...args) => {
  void args;
  const snapshot = await adminDb.collection("businesses").orderBy("createdAt", "desc").limit(100).get();
  return ok({ businesses: snapshot.docs.map((item) => ({ id: item.id, name: item.get("name"), ownerId: item.get("ownerId"), plan: item.get("plan"), maxBranches: item.get("maxBranches"), trialEndsAt: item.get("trialEndsAt")?.toDate().toISOString(), planExpiresAt: item.get("planExpiresAt")?.toDate().toISOString() })) });
}, { roles: ["admin"] });
