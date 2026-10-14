Audit the codebase against the "Security rules" section of CLAUDE.md:
- every route in src/app/api uses withAuth (except documented public routes) and Zod validation
- no client code writes to cards/scans/redemptions/scratchCards/stats
- firestore.rules matches docs/DATA_MODEL.md (🔒 vs ✏️)
- no admin secrets reachable from client bundles
Report issues as a checklist, then fix them.
