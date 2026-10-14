// Usage: npm run set-admin -- user@example.com
import { adminAuth, adminDb } from "../src/lib/firebase/admin";
const email = process.argv[2];
if (!email) throw new Error("email required");
const user = await adminAuth.getUserByEmail(email);
await adminAuth.setCustomUserClaims(user.uid, { role: "admin" });
await adminDb.doc(`users/${user.uid}`).set({ role: "admin" }, { merge: true });
console.log(`✔ ${email} is now admin`);
