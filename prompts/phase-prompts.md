# Copy-paste prompts for Claude Code

**Phase 0**
> Read CLAUDE.md and docs/. Complete Phase 0 of docs/ROADMAP.md: implement src/lib/firebase/client.ts and admin.ts using the existing stubs, and verify `npm run build` passes.

**Phase 1**
> Implement Phase 1 (auth & roles) exactly per docs/ARCHITECTURE.md §2–3.1 and docs/API.md. Include AuthProvider, useAuth, withAuth, /login, /onboarding, onboarding API routes. Write Vitest tests for withAuth.

**Phase 2**
> Build the marketing landing page per docs/UI_SPEC.md. Original copy only. Use plans from src/config/plans.ts. Make it beautiful, mobile-first, with subtle framer-motion animations.

**Phase 3**
> Implement the core loyalty loop (Phase 3). Follow the /api/scan algorithm in docs/API.md exactly, inside a Firestore transaction. Add unit tests for cooldown, reward unlock and idempotency.

**Any phase**
> Continue with the next unchecked item in docs/ROADMAP.md. Plan briefly, implement, run lint/typecheck/build, then tick the box.
