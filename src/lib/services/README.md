Data-access layer. Components/hooks call these; they never import Firestore directly.
- `*.service.ts` with `"server-only"` → Admin SDK, used by API routes (scan, redeem, onboarding, billing)
- `*.client.ts` → client SDK reads/subscriptions (cards.client.ts, business.client.ts, stats.client.ts)
