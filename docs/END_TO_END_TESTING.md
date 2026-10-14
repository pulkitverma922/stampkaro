# StampKaro End-to-End Testing Guide

Use a production-like Firebase project with Google and Email/Password enabled. Keep browser DevTools open and fail the test if an uncaught console error appears.

## Test accounts

Create unique accounts for each role:

| Role | Suggested account | Setup |
|---|---|---|
| Customer | `customer+e2e@example.com` | Sign in from `/login` |
| Owner | `owner+e2e@example.com` | Sign in from `/login?type=owner` and create a business |
| Staff | `staff+e2e@example.com` | Create customer account first, then owner adds the email in Settings |
| Admin | your trusted email | Run `npm run set-admin -- <email>` then sign out/in |

Never reuse one account across owner and customer scenarios unless testing role enforcement.

## 1. Public and marketing

- [ ] `/` loads without authentication or console errors.
- [ ] Header links reach Features, How It Works, Pricing, and Contact.
- [ ] Customer CTA opens `/login`; business CTA opens `/login?type=owner`.
- [ ] `/pricing`, `/contact`, `/privacy`, and `/terms` load.
- [ ] `/manifest.webmanifest`, `/robots.txt`, `/sitemap.xml`, and `/opengraph-image` return successfully.
- [ ] At 375px width, content does not overflow horizontally.

## 2. Customer authentication and wallet

- [ ] New customer Google/email login goes directly to `/wallet`; no role-selection screen appears.
- [ ] Existing customer login goes directly to `/wallet`.
- [ ] Wallet header shows Wallet, Surprises, customer name, and logout.
- [ ] Logout clears the session and returns to `/`.
- [ ] Visiting `/wallet` after logout redirects to `/login?next=/wallet`.
- [ ] Empty wallet explains that the customer must scan a participating business QR.

## 3. Owner onboarding

- [ ] `/login?type=owner` has business-specific copy.
- [ ] A new owner is taken directly to business setup.
- [ ] Required validation blocks incomplete or invalid fields.
- [ ] Successful setup creates business, first branch, QR, slug, trial, and owner role.
- [ ] Owner reaches `/dashboard` and sees launch checklist, trial banner, and zero-state chart.
- [ ] Refreshing `/dashboard` keeps the owner signed in.

## 4. QR scan and loyalty card

Obtain the scan URL from Dashboard → QR code.

- [ ] Public `/s/<qrId>` displays the correct business and reward.
- [ ] Signed-out customer is prompted to sign in and returns to the same scan URL.
- [ ] First valid scan creates a wallet card and increments business/daily stats.
- [ ] Repeating the same hourly scan is idempotent.
- [ ] A scan inside cooldown shows a friendly cooldown message.
- [ ] Daily scan limit is enforced.
- [ ] Final required stamp changes the card to `rewardReady`.
- [ ] Owner/staff accounts cannot collect customer stamps.
- [ ] Inactive or unknown QR returns a friendly not-found error.

## 5. Redemption

- [ ] Reward-ready card shows Redeem.
- [ ] Redeem generates a six-digit code with ten-minute expiry.
- [ ] Duplicate redemption request reuses the valid pending code.
- [ ] Owner sees it live under Dashboard → Redemptions.
- [ ] Owner can confirm via queue button and manual code entry.
- [ ] Confirmation resets stamps, increments completed rewards, and updates stats.
- [ ] Confirmed and expired codes cannot be reused.
- [ ] Another business owner cannot confirm the code.

## 6. Scratch cards

Configure scratch rewards in the business document/settings before deterministic testing.

- [ ] Successful eligible scan may return a scratch card.
- [ ] Customer sees it under `/wallet/scratch`.
- [ ] Secret prize is not readable through client Firestore access.
- [ ] Scratching over 60% reveals the server-selected prize.
- [ ] Refresh preserves the revealed result.
- [ ] Another customer cannot reveal the card.

## 7. Owner dashboard

- [ ] KPIs match Firestore business counters.
- [ ] Thirty-day chart matches `dailyStats`.
- [ ] Customer table loads 20 records and Next/First pagination works.
- [ ] Rewards page updates reward title, stamp requirement, cooldown, daily limit, and GPS setting.
- [ ] QR PNG downloads and encodes the correct `/s/<qrId>` URL.
- [ ] Print poster renders only the poster content.

## 8. Staff

- [ ] Staff creates an account before invitation.
- [ ] Owner adds staff by exact email.
- [ ] Staff signs out/in to refresh role claim.
- [ ] Staff reaches dashboard/redemptions and can confirm rewards.
- [ ] Staff cannot update rewards, branches, billing, or add other staff.
- [ ] Owner/admin accounts cannot be downgraded through staff invitation.

## 9. Multi-branch and GPS

- [ ] Branch page displays used/max branch allowance.
- [ ] Map click and browser location update coordinates.
- [ ] Adding above plan limit returns `BRANCH_LIMIT`.
- [ ] Final active branch cannot be deleted.
- [ ] Multi-branch scan requires location.
- [ ] Nearest active branch is stored on scan.
- [ ] Out-of-radius scan is rejected.
- [ ] Dashboard shows branch scan totals.

## 10. Digital menu and AI import

- [ ] Owner can add/edit/remove categories and items manually.
- [ ] Publishing replaces the prior menu atomically enough for supported limits.
- [ ] `/m/<slug>` shows only available items, ordered by category/item order.
- [ ] Prices are displayed from integer paise.
- [ ] With `GEMINI_API_KEY`, pasted text returns reviewable structured data.
- [ ] Without Gemini configuration, manual editing works and AI shows a clear configuration error.

## 11. Billing and plan behavior

Use Razorpay test mode only.

- [ ] Trial banner counts down correctly.
- [ ] Expired business scans return `PLAN_EXPIRED`.
- [ ] Checkout order amount matches the selected plan in paise.
- [ ] Invalid webhook signature returns 401.
- [ ] `payment.captured` activates the plan and max branches.
- [ ] Replayed webhook order is idempotent.

## 12. Admin

- [ ] Non-admin cannot open `/admin` or call admin APIs.
- [ ] Admin sees up to 100 newest businesses.
- [ ] Admin can assign trial/basic/growth/pro/enterprise.
- [ ] Branch allowance updates with plan.
- [ ] Admin sign-out works.

## 13. Security and failure cases

- [ ] Client cannot write cards, scans, redemptions, scratch cards, stats, plans, or staff documents.
- [ ] Every protected API rejects missing/invalid ID tokens.
- [ ] Owner APIs reject another owner’s `bizId`.
- [ ] Zod validation rejects malformed payloads.
- [ ] Rate-limited scan/redemption calls return 429.
- [ ] No `FIREBASE_ADMIN_*`, Razorpay secret, webhook secret, or Gemini key appears in browser bundles/network responses.
- [ ] Global error UI handles an injected route error without exposing secrets.

## 14. PWA, accessibility, and performance

- [ ] Production app is installable and uses the StampKaro icon/theme.
- [ ] Previously viewed pages show the offline fallback when disconnected.
- [ ] API requests are never cached by the service worker.
- [ ] Keyboard-only navigation reaches all controls with visible focus.
- [ ] Form fields have labels and icon buttons have accessible names.
- [ ] Test at 375px, 768px, and desktop widths.
- [ ] Run Lighthouse in production/preview and target ≥90 for Performance, Accessibility, Best Practices, and SEO.

## Release gate

Run before every release:

```powershell
npm run test
npm run lint
npm run typecheck
npm run build
npm run deploy:rules
```

Do not release if any command fails, a critical user flow above fails, or secrets appear in Git/browser output.
