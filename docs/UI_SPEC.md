# UI Spec

## Design tokens
- Font: Inter (body) + Plus Jakarta Sans (headings) via `next/font`
- Primary: violet-600 `#7C3AED`, accent: amber-400 `#FBBF24`, success: emerald-500
- Radius: `rounded-2xl` cards, `rounded-full` pills/buttons
- Light mode default, dark mode via `class` strategy
- Motion: framer-motion, 150–300 ms, spring on stamp add; confetti on reward unlock
- Mobile-first; dashboard has sidebar ≥ md, bottom tab bar < md

## Route map (`src/app`)
| Route | Group | Purpose |
|---|---|---|
| `/` | (marketing) | Landing: hero, features, 3 steps, stats, pricing, FAQ, footer |
| `/pricing`, `/privacy`, `/terms`, `/contact` | (marketing) | static |
| `/login` | (auth) | Customer sign-in; `?type=owner` shows business copy |
| `/onboarding` | (auth) | Choose role → owner wizard (3 steps) |
| `/s/[qrId]` | public | Scan landing → sign-in → add stamp → result animation |
| `/m/[slug]` | public | Digital menu |
| `/wallet` | (customer) | All my stamp cards |
| `/wallet/[bizId]` | (customer) | Card detail, redeem button, history |
| `/wallet/scratch` | (customer) | Unrevealed scratch cards |
| `/dashboard` | (owner) | KPIs (today scans, active customers, rewards ready, repeat %), 30-day chart |
| `/dashboard/customers` | (owner) | Paginated table of cards |
| `/dashboard/redemptions` | (owner) | Live pending redemptions + code entry |
| `/dashboard/rewards` | (owner) | Reward & rules & scratch config |
| `/dashboard/branches` | (owner) | Branch list + map picker (Leaflet + OSM, free) |
| `/dashboard/menu` | (owner) | Menu editor + AI import |
| `/dashboard/qr` | (owner) | QR preview, download PNG/PDF poster |
| `/dashboard/settings` | (owner) | Profile, staff, billing |
| `/admin` | (admin) | Businesses list, set plan |

## Key components
- `landing/Hero`, `FeatureGrid`, `HowItWorks`, `StatsBand`, `PricingTable`, `Faq`, `Footer`
- `customer/StampCard` (grid of N circles, filled with brand color, animated)
- `customer/ScratchCard` (canvas scratch-off, reveal at 60% cleared)
- `customer/RedeemDialog` (big 6-digit code + countdown)
- `dashboard/KpiCard`, `ScansChart` (Recharts area), `CustomersTable`, `RedemptionQueue`
- `shared/AuthGuard` (role-based), `shared/Logo`, `shared/EmptyState`

## Brand
- Name: **StampKaro**
- Tagline: **“Har visit pe stamp, har stamp pe reward.”**

## Landing copy guidance
Write ORIGINAL copy. Value prop: "repeat customers without an app". Pricing tiers (our own numbers,
editable in `src/config/plans.ts`): Starter / Growth / Pro / Enterprise.
