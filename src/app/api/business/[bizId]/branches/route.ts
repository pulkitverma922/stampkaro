import { Timestamp } from "firebase-admin/firestore";
import { withAuth } from "@/lib/firebase/auth-server";
import { adminDb } from "@/lib/firebase/admin";
import { branchSchema } from "@/lib/validation/schemas";
import { ApiError, ok } from "@/lib/utils/api";

export const POST = withAuth(async (req, { params }: { params: Promise<{ bizId: string }> }, user) => {
  const { bizId } = await params;
  const body = branchSchema.parse(await req.json());
  const businessRef = adminDb.doc(`businesses/${bizId}`);
  const branchRef = businessRef.collection("branches").doc();
  await adminDb.runTransaction(async (transaction) => {
    const [business, branches] = await Promise.all([transaction.get(businessRef), transaction.get(businessRef.collection("branches").limit(100))]);
    if (!business.exists) throw new ApiError("NOT_FOUND", "Business not found", 404);
    if (business.get("ownerId") !== user.uid && user.role !== "admin") throw new ApiError("FORBIDDEN", "You do not own this business", 403);
    if (branches.size >= business.get("maxBranches")) throw new ApiError("BRANCH_LIMIT", `Your plan supports ${business.get("maxBranches")} branches`, 403);
    transaction.create(branchRef, { ...body, isActive: true, createdAt: Timestamp.now() });
  });
  return ok({ branchId: branchRef.id }, 201);
}, { roles: ["owner"] });
