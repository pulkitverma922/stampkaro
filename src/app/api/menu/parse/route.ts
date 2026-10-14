import { withAuth } from "@/lib/firebase/auth-server";
import { adminDb } from "@/lib/firebase/admin";
import { menuImportResultSchema, menuParseSchema } from "@/lib/validation/schemas";
import { ApiError, ok } from "@/lib/utils/api";

export const POST = withAuth(async (req, _ctx, user) => {
  const body = menuParseSchema.parse(await req.json());
  const business = await adminDb.doc(`businesses/${body.bizId}`).get();
  if (!business.exists) throw new ApiError("NOT_FOUND", "Business not found", 404);
  if (business.get("ownerId") !== user.uid && user.role !== "admin") throw new ApiError("FORBIDDEN", "You do not own this business", 403);
  if (!process.env.GEMINI_API_KEY) throw new ApiError("INTERNAL", "Add GEMINI_API_KEY to enable AI import", 503);
  const prompt = `Convert this business menu into strict JSON. Return only JSON matching {"categories":[{"name":"string","items":[{"name":"string","description":"optional string","pricePaise":integer,"isVeg":boolean,"imageUrl":"","available":true}]}]}. Prices must be integer paise. Never invent unavailable prices or products. Menu:\n${body.text}`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.1 } }),
  });
  if (!response.ok) throw new ApiError("INTERNAL", "AI menu import is temporarily unavailable", 502);
  const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new ApiError("INTERNAL", "AI returned an empty menu", 502);
  return ok(menuImportResultSchema.parse(JSON.parse(text)));
}, { roles: ["owner"] });
