# API Contracts (Next.js Route Handlers, `src/app/api/**/route.ts`)

All routes: `Authorization: Bearer <Firebase ID token>` unless marked **public**.
Responses: `{ ok: true, data }` or `{ ok: false, error: { code, message } }`.
Use helper `withAuth(handler, { roles })` from `src/lib/firebase/auth-server.ts`.

| Method & path | Role | Body (Zod) | Returns |
|---|---|---|---|
| POST `/api/onboarding/customer` | any signed-in | `{ displayName?, phone? }` | `{ user }` |
| POST `/api/onboarding/owner` | any signed-in | `{ businessName, category, rewardTitle, requiredStamps(3-20), branch:{name,address,lat?,lng?} }` | `{ bizId, qrId }` |
| PATCH `/api/business/:bizId` | owner | partial profile/reward/rules/scratchConfig | `{ business }` |
| POST `/api/business/:bizId/branches` | owner | `{ name, address, lat, lng }` | `{ branchId }` (403 if over maxBranches) |
| DELETE `/api/business/:bizId/branches/:branchId` | owner | – | `{}` |
| POST `/api/business/:bizId/staff` | owner | `{ email }` | `{}` |
| POST `/api/scan` | customer | `{ qrId, lat?, lng? }` | `{ card, rewardUnlocked, scratchCard? }` |
| POST `/api/redeem` | customer | `{ cardId }` | `{ redemptionId, code, expiresAt }` |
| POST `/api/redeem/confirm` | owner/staff | `{ redemptionId }` or `{ bizId, code }` | `{ card }` |
| POST `/api/scratch/reveal` | customer | `{ scratchCardId }` | `{ prizeLabel }` |
| POST `/api/menu/parse` | owner | `{ bizId, text }` | `{ categories:[{name, items:[...]}] }` |
| GET `/api/qr/:bizId/poster` | owner | – | PNG/PDF printable poster |
| GET `/api/public/qr/:qrId` | **public** | – | `{ businessName, logoUrl, reward }` |
| POST `/api/billing/webhook` | **public** (signature) | Razorpay payload | `{}` |

## Error codes
`UNAUTHENTICATED, FORBIDDEN, VALIDATION, NOT_FOUND, COOLDOWN, DAILY_LIMIT, OUT_OF_RANGE,
PLAN_EXPIRED, BRANCH_LIMIT, ALREADY_REDEEMED, CODE_EXPIRED, INTERNAL`

## /api/scan algorithm (inside `db.runTransaction`)
1. Load `qrCodes/{qrId}` → 404 if missing/inactive.
2. Load business → `PLAN_EXPIRED` if trial & plan both past.
3. If `rules.gpsRequired` or branches > 1: require lat/lng, find nearest active branch (Haversine);
   if distance > `radiusMeters` → `OUT_OF_RANGE`.
4. Load `cards/{uid_bizId}`; if `lastScanAt` within `cooldownHours` → `COOLDOWN` (return nextAllowedAt).
5. Card status `rewardReady` → don't add stamp, return card (prompt redeem).
6. Write: card (create or `stamps+1`; if reaches required → `rewardReady`), scan doc,
   `business.stats` increments (`totalCustomers` only when card new), `dailyStats` increments.
7. Maybe create scratch card (server RNG via `crypto.randomInt`).
