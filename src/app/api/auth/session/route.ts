import { cookies } from "next/headers";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { ApiError, ok, toErrorResponse } from "@/lib/utils/api";
import type { Role } from "@/types/models";

const sessionSchema = z.object({ idToken: z.string().min(1), intent: z.enum(["customer", "owner"]).default("customer") });
const SESSION_MAX_AGE = 60 * 60 * 24 * 5;

export async function POST(req: Request) {
  try {
    const { idToken, intent } = sessionSchema.parse(await req.json());
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      throw new ApiError("UNAUTHENTICATED", "Please sign in again", 401);
    }

    const userRef = adminDb.doc(`users/${decoded.uid}`);
    let profile = await userRef.get();
    if (!profile.exists && intent === "customer") {
      await userRef.set({
        uid: decoded.uid,
        email: decoded.email ?? "",
        displayName: decoded.name ?? decoded.email?.split("@")[0] ?? "Customer",
        photoURL: decoded.picture ?? null,
        role: "customer",
        ownedBusinessIds: [],
        createdAt: FieldValue.serverTimestamp(),
      });
      const authUser = await adminAuth.getUser(decoded.uid);
      await adminAuth.setCustomUserClaims(decoded.uid, { ...authUser.customClaims, role: "customer" });
      profile = await userRef.get();
    }
    const role = profile.exists ? profile.get("role") as Role : null;
    const destination = profile.exists
      ? role === "customer" ? "/wallet" : role === "admin" ? "/admin" : "/dashboard"
      : "/onboarding";

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE * 1000,
    });
    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return ok({ destination, role, hasProfile: profile.exists });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return ok({});
}
