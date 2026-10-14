import { Timestamp } from "firebase-admin/firestore";
import { withAuth } from "@/lib/firebase/auth-server";
import { adminDb } from "@/lib/firebase/admin";
import { menuSaveSchema } from "@/lib/validation/schemas";
import { ApiError, ok } from "@/lib/utils/api";

export const POST = withAuth(async (req, _ctx, user) => {
  const { bizId, categories } = menuSaveSchema.parse(await req.json());
  const businessRef = adminDb.doc(`businesses/${bizId}`);
  const business = await businessRef.get();
  if (!business.exists) throw new ApiError("NOT_FOUND", "Business not found", 404);
  if (business.get("ownerId") !== user.uid && user.role !== "admin") throw new ApiError("FORBIDDEN", "You do not own this business", 403);
  const [existingCategories, existingItems] = await Promise.all([businessRef.collection("menuCategories").limit(500).get(), businessRef.collection("menuItems").limit(1000).get()]);
  const replacementWrites = categories.length + categories.reduce((total, category) => total + category.items.length, 0);
  if (replacementWrites > 420) throw new ApiError("VALIDATION", "Menu is too large to publish safely", 422);
  for (const documents of [existingCategories.docs, existingItems.docs]) {
    for (let offset = 0; offset < documents.length; offset += 450) { const deletionBatch = adminDb.batch(); documents.slice(offset, offset + 450).forEach((item) => deletionBatch.delete(item.ref)); await deletionBatch.commit(); }
  }
  const batch = adminDb.batch();
  categories.forEach((category, categoryOrder) => { const categoryRef = businessRef.collection("menuCategories").doc(); batch.create(categoryRef, { name: category.name, order: categoryOrder, createdAt: Timestamp.now() }); category.items.forEach((item, itemOrder) => { const itemRef = businessRef.collection("menuItems").doc(); batch.create(itemRef, { categoryId: categoryRef.id, ...item, order: itemOrder, imageUrl: item.imageUrl || "" }); }); });
  await batch.commit();
  return ok({ categories: categories.length });
}, { roles: ["owner"] });
