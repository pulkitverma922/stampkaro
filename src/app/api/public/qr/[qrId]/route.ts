import { adminDb } from "@/lib/firebase/admin";
import { ApiError, ok, toErrorResponse } from "@/lib/utils/api";

export async function GET(_req: Request, { params }: { params: Promise<{ qrId: string }> }) {
  try {
    const { qrId } = await params;
    const qrSnapshot = await adminDb.doc(`qrCodes/${qrId}`).get();
    if (!qrSnapshot.exists || !qrSnapshot.get("active")) throw new ApiError("NOT_FOUND", "QR code not found", 404);
    const businessSnapshot = await adminDb.doc(`businesses/${qrSnapshot.get("bizId")}`).get();
    if (!businessSnapshot.exists) throw new ApiError("NOT_FOUND", "Business not found", 404);
    const business = businessSnapshot.data()!;
    const branches = await businessSnapshot.ref.collection("branches").where("isActive", "==", true).limit(2).get();
    return ok({ bizId: businessSnapshot.id, businessName: business.name, logoUrl: business.logoUrl ?? "", brandColor: business.brandColor, reward: business.reward, gpsRequired: (business.rules?.gpsRequired ?? false) || branches.size > 1 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
