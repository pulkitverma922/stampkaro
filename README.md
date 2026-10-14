# StampKaro — QR Loyalty Platform

> **Har visit pe stamp, har stamp pe reward.**

StampKaro helps local businesses reward repeat customers through QR-based digital stamp cards—without requiring customers to install an app. Built with Next.js, Firebase, and Vercel.

## Local development

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set the Firebase web-app values and Firebase Admin credentials in `.env.local` before using authenticated features. Local development connects to the Firebase project configured in those values.
Use a separate development Firebase project for local testing if you do not want test actions to modify production data.

## Deploy to Firebase

This is a full-stack Next.js application with server-side API routes. Use **Firebase App Hosting**, not classic static Firebase Hosting. App Hosting supports Next.js and requires the **Blaze pay-as-you-go plan**. Firebase usage can still fall within no-cost quotas, but enabling billing means charges are possible.

1. Upgrade the `stampkaro-922` Firebase project to Blaze and configure a billing account.
2. In Firebase Console, open **Hosting & Serverless → App Hosting → Get started**. Connect this repository and its production branch, and choose a region.
3. Configure the environment values from `.env.example` in the App Hosting backend. Provide `NEXT_PUBLIC_FIREBASE_*` and `NEXT_PUBLIC_APP_URL` as environment variables. Store `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and `FIREBASE_ADMIN_PRIVATE_KEY` as Secret Manager-backed secrets; never commit the private key. Configure optional Gemini and Razorpay secrets only when those features are enabled.
4. Before the first production rollout, deploy Firestore rules and indexes with `npm run deploy:rules`. Ensure the Firebase CLI is signed in and targets `stampkaro-922`.
5. Add the deployed App Hosting domain under **Authentication → Settings → Authorized domains**. Set `NEXT_PUBLIC_APP_URL` to the deployed HTTPS URL and trigger a rollout again if needed.
6. For Razorpay, configure the webhook as `https://<your-domain>/api/billing/webhook` and subscribe to `payment.captured`.
7. Verify sign-in, onboarding, scan and redemption flows, and the webhook before inviting users. Add a custom domain in App Hosting when ready.

Firebase's official guides: [App Hosting setup](https://firebase.google.com/docs/app-hosting/get-started), [environment variables and secrets](https://firebase.google.com/docs/app-hosting/configure), and [Next.js framework-aware Hosting](https://firebase.google.com/docs/hosting/frameworks/nextjs).

**Spark limitation:** Spark is not enough to host this dynamic Next.js app entirely on Firebase. Classic Firebase Hosting can serve static output, but dynamic server logic is deployed as Cloud Functions, which requires Blaze. To keep the app on Spark, host the Next.js application on Vercel and continue using Firebase for Authentication and Firestore.

## Checks

```powershell
npm run test
npm run lint
npm run typecheck
npm run build
```

See [docs/SETUP.md](./docs/SETUP.md), [docs/ROADMAP.md](./docs/ROADMAP.md), and [docs/END_TO_END_TESTING.md](./docs/END_TO_END_TESTING.md).
