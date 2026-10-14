# Firestore Data Model

> Source of truth. Keep `src/types/models.ts` and `firestore.rules` in sync with this file.
> 🔒 = written only by server (Admin SDK). ✏️ = client-writable (rules-guarded).

```
users/{uid}
businesses/{bizId}
  ├─ branches/{branchId}
  ├─ staff/{uid}
  ├─ menuCategories/{catId}
  ├─ menuItems/{itemId}
  └─ dailyStats/{yyyy-mm-dd}
qrCodes/{qrId}
cards/{uid_bizId}
scans/{scanId}
redemptions/{redemptionId}
scratchCards/{id}
slugs/{slug}
```

## users/{uid} 🔒 (except `displayName`, `phone` ✏️)
| field | type | notes |
|---|---|---|
| uid | string | |
| email | string | |
| displayName | string | |
| photoURL | string? | |
| phone | string? | |
| role | `"customer" \| "owner" \| "staff" \| "admin"` | mirror of custom claim |
| ownedBusinessIds | string[] | |
| staffBusinessIds | string[]? | businesses where this user is staff |
| createdAt | Timestamp | |

## businesses/{bizId} ✏️ owner (profile fields only) / 🔒 plan & stats
| field | type | notes |
|---|---|---|
| name, slug, category | string | category: cafe, salon, gym, restaurant, retail, other |
| logoUrl, brandColor | string | |
| ownerId | string | |
| plan | `"trial" \| "basic" \| "growth" \| "pro" \| "enterprise"` | 🔒 |
| maxBranches | number | 🔒 1 / 3 / 6 / 999 |
| trialEndsAt, planExpiresAt | Timestamp | 🔒 |
| reward | `{ title: string; requiredStamps: number; description?: string }` | ✏️ |
| rules | `{ cooldownHours: number; maxScansPerDay: number; gpsRequired: boolean; radiusMeters: number }` | ✏️ |
| scratchConfig | `{ enabled: boolean; probability: number; prizes: {label: string; weight: number}[] }` | ✏️ |
| stats | `{ totalScans; totalCustomers; rewardsRedeemed; activeCards }` | 🔒 increments |
| createdAt, updatedAt | Timestamp | |

### branches/{branchId} ✏️ owner
`name, address, lat, lng, isActive, createdAt` — count limited by `maxBranches` (enforced in API).

### staff/{uid} 🔒
`email, role: "staff", addedAt`

### menuCategories/{catId}, menuItems/{itemId} ✏️ owner, public read
Category: `name, order`. Item: `categoryId, name, description, pricePaise, isVeg, imageUrl?, available, order`.

### dailyStats/{yyyy-mm-dd} 🔒
`scans, newCustomers, rewardsRedeemed, byBranch: { [branchId]: number }`

## qrCodes/{qrId} 🔒 (public read)
`bizId, active, createdAt` — `qrId` is an 8-char nanoid printed in the URL `/s/{qrId}`.
One QR per business; branch resolved via GPS.

## cards/{uid_bizId} 🔒 (read: owning customer + business owner/staff)
| field | type |
|---|---|
| customerId, bizId | string |
| customerName | string (denormalized) |
| businessName, businessLogo | string (denormalized) |
| stamps, requiredStamps | number |
| completedCount | number |
| status | `"active" \| "rewardReady"` |
| lastScanAt, createdAt | Timestamp |

## scans/{scanId} 🔒
`customerId, bizId, dayKey, branchId?, lat?, lng?, distanceM?, createdAt` — ID = `${uid}_${bizId}_${yyyymmddHH}` (idempotent). `dayKey` is the IST date (`yyyy-mm-dd`) used for per-day scan limits.

## redemptions/{id} 🔒
`cardId, customerId, bizId, code (6 digits), status: "pending"|"confirmed"|"expired", expiresAt, confirmedBy?, createdAt`

## scratchCards/{id} 🔒
`customerId, bizId, revealed, prizeLabel (null until revealed), revealedAt?, createdAt`

The actual prize is stored in `scratchCards/{id}/secret/prize` (`{ label: string | null }`), which has **no** client read rule, so customers can't peek before scratching. `/api/scratch/reveal` copies it to `prizeLabel`.

## slugs/{slug} 🔒
`bizId` — guarantees unique public slugs for `/m/[slug]`.

## Composite indexes (see firestore.indexes.json)
- cards: `bizId ASC, lastScanAt DESC`
- cards: `customerId ASC, lastScanAt DESC`
- redemptions: `bizId ASC, status ASC, createdAt DESC`
- scans: `bizId ASC, createdAt DESC`
- menuItems: `categoryId ASC, order ASC`
