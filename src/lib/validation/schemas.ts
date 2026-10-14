import { z } from "zod";

export const categoryEnum = z.enum(["cafe", "salon", "gym", "restaurant", "retail", "other"]);
const latLng = { lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) };

export const customerOnboardingSchema = z.object({
  displayName: z.string().trim().min(2).max(60).optional(),
  phone: z.string().trim().min(7).max(20).optional(),
});

export const ownerOnboardingSchema = z.object({
  businessName: z.string().trim().min(2).max(60),
  category: categoryEnum,
  rewardTitle: z.string().trim().min(2).max(60),
  requiredStamps: z.number().int().min(3).max(20),
  branch: z.object({ name: z.string().min(1).max(60), address: z.string().max(200), lat: latLng.lat.optional(), lng: latLng.lng.optional() }),
});

export const scanSchema = z.object({ qrId: z.string().min(6).max(16), lat: latLng.lat.optional(), lng: latLng.lng.optional() });
export const redeemSchema = z.object({ cardId: z.string().min(1) });
export const confirmRedeemSchema = z.union([
  z.object({ redemptionId: z.string().min(1) }),
  z.object({ bizId: z.string().min(1), code: z.string().regex(/^\d{6}$/) }),
]);
export const branchSchema = z.object({ name: z.string().trim().min(1).max(60), address: z.string().trim().min(1).max(200), ...latLng });
export const branchUpdateSchema = branchSchema.extend({ isActive: z.boolean() });
export const scratchRevealSchema = z.object({ scratchCardId: z.string().min(1) });

export const businessUpdateSchema = z.object({
  reward: z.object({ title: z.string().trim().min(2).max(60), requiredStamps: z.number().int().min(3).max(20), description: z.string().trim().max(200).optional() }).optional(),
  rules: z.object({ cooldownHours: z.number().min(0).max(168), maxScansPerDay: z.number().int().min(1).max(20), gpsRequired: z.boolean(), radiusMeters: z.number().int().min(50).max(5000) }).optional(),
  scratchConfig: z.object({ enabled: z.boolean(), probability: z.number().min(0).max(1), prizes: z.array(z.object({ label: z.string().trim().min(1).max(60), weight: z.number().positive() })).max(20) }).optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one setting is required");

export const staffInviteSchema = z.object({ email: z.string().trim().email().toLowerCase() });

export const menuItemInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(300).optional(),
  pricePaise: z.number().int().min(0).max(10_000_000),
  isVeg: z.boolean(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  available: z.boolean().default(true),
});
export const menuImportResultSchema = z.object({
  categories: z.array(z.object({ name: z.string().trim().min(1).max(60), items: z.array(menuItemInputSchema).max(50) })).min(1).max(20).refine((categories) => categories.reduce((total, category) => total + category.items.length, 0) <= 400, "A menu can contain at most 400 items"),
});
export const menuSaveSchema = z.object({ bizId: z.string().min(1), ...menuImportResultSchema.shape });
export const menuParseSchema = z.object({ bizId: z.string().min(1), text: z.string().trim().min(10).max(20_000) });
