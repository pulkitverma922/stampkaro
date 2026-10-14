# CLAUDE.md — Project Memory for Claude Code

## What we are building
**StampKaro** — a QR-based digital loyalty platform for local businesses (cafés, salons, gyms,
restaurants). Customers scan one QR code per visit, collect digital stamps, and unlock rewards.
No app download — it is a mobile-first web app.

Tagline: **“Har visit pe stamp, har stamp pe reward.”**

Inspired by the *concept* of druto.in. **Do NOT copy their text, logos, images, or code.**
Write all copy, branding and visuals from scratch.

## Read these before coding
1. `docs/ARCHITECTURE.md` — system design & request flows
2. `docs/DATA_MODEL.md` — Firestore collections (source of truth for types)
3. `docs/API.md` — server route contracts
4. `docs/UI_SPEC.md` — pages, components, design tokens
5. `docs/ROADMAP.md` — build order; work ONE phase at a time

## Tech stack (fixed — do not swap without asking)
- Next.js 15 (App Router) + TypeScript (strict) + React 19
- Tailwind CSS v4 + shadcn/ui + lucide-react + framer-motion
- Firebase **Spark (free) plan**: Authentication + Cloud Firestore + Hosting (optional)
- `firebase` (client SDK v11) and `firebase-admin` (server, in Next.js route handlers)
- Zod for validation, react-hook-form for forms, Recharts for charts
- `qrcode` for QR generation, `html5-qrcode` only if in-app scanning is needed
- Deploy: **Vercel Hobby** (free) — runs our API routes, replacing Cloud Functions

## Hard constraints (Spark plan)
- **No Cloud Functions** (requires Blaze). All trusted logic lives in `src/app/api/**` route
  handlers using `firebase-admin`.
- **No Cloud Storage** dependency. Logos/menu images: store small images as URLs
  (e.g. user pastes a link) or use a free external host. Keep this behind `src/lib/services/storage.ts`.
- Firestore free quota is small (≈50K reads / 20K writes / 20K deletes per day). Therefore:
  - Denormalize counters (e.g. `business.stats`) instead of counting documents.
  - Always paginate with `limit()`. Never read whole collections on the client.
  - Aggregate analytics into `dailyStats/{yyyy-mm-dd}` docs on write.
- Phone/SMS auth has very low free limits → use **Google sign-in + Email/Password** as primary.

## Security rules (non-negotiable)
- Clients may NEVER write stamps, rewards, redemptions, or stats directly.
  Those writes only happen in API routes via Admin SDK inside a Firestore **transaction**.
- Every API route: verify Firebase ID token (`verifyIdToken`) → check role → validate body with Zod.
- `firestore.rules` must deny by default. Update rules + `docs/DATA_MODEL.md` together.
- Never expose `FIREBASE_ADMIN_*` env vars to the client (no `NEXT_PUBLIC_` prefix).

## Conventions
- Folders: `src/app` (routes), `src/components/<area>`, `src/lib/services` (Firestore access —
  components never call Firestore directly), `src/lib/validation` (Zod), `src/types`.
- Server-only files import `"server-only"` at the top.
- Named exports, functional components, no `any`. Dates stored as Firestore `Timestamp`.
- Money in paise (integers). IDs are Firestore auto-IDs except where documented.
- Mobile-first UI; test at 375px width.
- After each feature: run `npm run lint && npm run typecheck && npm run build`.

## Commands
- `npm run dev` — local dev (http://localhost:3000)
- `npm run lint` / `npm run typecheck` / `npm run test`
- `npm run deploy:rules` — deploy Firestore rules & indexes

## Workflow for Claude
1. Pick the next unchecked task in `docs/ROADMAP.md`.
2. Briefly state the plan, then implement.
3. Run checks, fix errors, tick the box in ROADMAP.md.
4. Never mark a task done if build/typecheck fails.
