# Firebase Setup

1. https://console.firebase.google.com → **Add project** (Analytics optional).
2. **Build → Authentication → Get started** → enable **Google** and **Email/Password**.
   Add each deployed site domain under *Settings → Authorized domains*.
3. **Build → Firestore Database → Create database** → Production mode → region `asia-south1` (Mumbai).
4. **Project settings → General → Your apps → Web app (</>)** → copy config into `NEXT_PUBLIC_FIREBASE_*`.
5. **Project settings → Service accounts → Generate new private key** → put
   `project_id`, `client_email`, `private_key` into `FIREBASE_ADMIN_*` (keep `\n` escaped, wrap in quotes).
   For local development, keep these in `.env.local`; for production, store the Admin values in
   the hosting provider's secret manager. Never commit the private key.
6. Sign in to the Firebase CLI and ensure the project alias points to `stampkaro-922`, then run
   `npm run deploy:rules`.

Local development connects directly to the configured Firebase project. Prefer a separate
development project so testing cannot change production users or data.

## Hosting

The app includes Next.js API routes and cannot be deployed as static files alone.

- **Firebase App Hosting:** supports this Next.js app and requires upgrading the Firebase project
  to the Blaze pay-as-you-go plan. Connect the repository under **Hosting & Serverless → App
  Hosting**, set the `NEXT_PUBLIC_FIREBASE_*` and `NEXT_PUBLIC_APP_URL` environment variables,
  and add `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and
  `FIREBASE_ADMIN_PRIVATE_KEY` as Secret Manager-backed secrets. Configure optional Gemini and
  Razorpay values as secrets if those features are used. Set the final app URL and authorize the
  App Hosting domain in Firebase Authentication before launch.
- **Vercel + Firebase Spark:** to avoid enabling Blaze, deploy the Next.js app to Vercel and use
  Firebase Spark for Authentication and Firestore. Configure the same environment values in
  Vercel; keep the Firebase Admin credentials as encrypted environment secrets.

Blaze requires a billing account and usage can incur charges even when the Firebase services used
are otherwise within no-cost quotas. See the [App Hosting setup guide](https://firebase.google.com/docs/app-hosting/get-started)
and [environment and secrets guide](https://firebase.google.com/docs/app-hosting/configure).
