# Roadmap — work one phase at a time, tick boxes as you go

## Phase 0 — Setup
- [x] Next.js app created, deps installed, shadcn initialised
- [x] `src/lib/firebase/client.ts` + `admin.ts` configured for the Firebase project
- [x] `.env.local` configured for Firebase project access
- [x] Deploy `firestore.rules` + indexes

## Phase 1 — Auth & roles
- [x] `/login` with Google + Email/Password (customer & owner variants)
- [x] `AuthProvider` context + `useAuth()` hook (user, role, loading)
- [x] `withAuth` server helper (verifyIdToken + role check)
- [x] `/onboarding` + `/api/onboarding/customer|owner` (sets custom claim)
- [x] `AuthGuard` + middleware redirects

## Phase 2 — Landing site
- [x] Marketing layout, Hero, Features, HowItWorks, Stats, Pricing (from `config/plans.ts`), FAQ, Footer
- [x] SEO metadata, OG image, sitemap, robots

## Phase 3 — Core loyalty loop (MVP!)
- [x] `/api/scan` transaction + tests (cooldown, reward unlock, idempotency)
- [x] `/s/[qrId]` scan page with animations
- [x] `/wallet` + `/wallet/[bizId]` with realtime `onSnapshot`
- [x] `/api/redeem` + `/api/redeem/confirm`
- [x] Owner `/dashboard/redemptions` live queue

## Phase 4 — Owner dashboard
- [x] KPIs + 30-day chart from `dailyStats`
- [x] Customers table (paginated)
- [x] Rewards & rules settings
- [x] QR page: download PNG + printable A5 poster
- [x] Staff invites

## Phase 5 — Multi-branch GPS
- [x] Branch CRUD + Leaflet map picker, maxBranches enforcement
- [x] Nearest-branch detection in `/api/scan`, branch-wise stats

## Phase 6 — Engagement
- [x] Scratch cards (config, creation on scan, reveal UI)
- [x] Digital menu editor + public `/m/[slug]`
- [x] AI menu import (`/api/menu/parse`)

## Phase 7 — Business
- [x] Trial expiry banner + plan gating
- [x] Razorpay checkout + webhook
- [x] Admin panel

## Phase 8 — Polish & launch
- [x] PWA manifest + icons, offline fallback
- [x] Rate limiting on API (per uid, in-memory/Upstash free)
- [x] Error tracking, analytics, Lighthouse ≥ 90 readiness
- [ ] Deploy to Vercel, custom domain, authorised domains in Firebase Auth (requires production Vercel/domain access)
