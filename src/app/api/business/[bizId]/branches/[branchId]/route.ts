import { withAuth } from "@/lib/firebase/auth-server";
import { adminDb } from "@/lib/firebase/admin";
import { branchUpdateSchema } from "@/lib/validation/schemas";
import { ApiError, ok } from "@/lib/utils/api";

async function assertOwner(bizId: string, uid: string, role: string) {
  const business = await adminDb.doc(`businesses/${bizId}`).get();
  if (!business.exists) throw new ApiError("NOT_FOUND", "Business not found", 404);
  if (business.get("ownerId") !== uid && role !== "admin") throw new ApiError("FORBIDDEN", "You do not own this business", 403);
}

export const PATCH = withAuth(async (req, { params }: { params: Promise<{ bizId: string; branchId: string }> }, user) => {
  const { bizId, branchId } = await params;
  const body = branchUpdateSchema.parse(await req.json());
  await assertOwner(bizId, user.uid, user.role);
  const branchRef = adminDb.doc(`businesses/${bizId}/branches/${branchId}`);
  if (!(await branchRef.get()).exists) throw new ApiError("NOT_FOUND", "Branch not found", 404);
  await branchRef.update(body);
  return ok({ branch: { id: branchId, ...body } });
}, { roles: ["owner"] });

export const DELETE = withAuth(async (_req, { params }: { params: Promise<{ bizId: string; branchId: string }> }, user) => {
  const { bizId, branchId } = await params;
  await assertOwner(bizId, user.uid, user.role);
  const businessRef = adminDb.doc(`businesses/${bizId}`);
  await adminDb.runTransaction(async (transaction) => {
    const branches = await transaction.get(businessRef.collection("branches").where("isActive", "==", true).limit(2));
    if (branches.size <= 1) throw new ApiError("FORBIDDEN", "Your business must keep at least one active branch", 409);
    const branchRef = businessRef.collection("branches").doc(branchId);
    if (!(await transaction.get(branchRef)).exists) throw new ApiError("NOT_FOUND", "Branch not found", 404);
    transaction.delete(branchRef);
  });
  return ok({});
}, { roles: ["owner"] });
