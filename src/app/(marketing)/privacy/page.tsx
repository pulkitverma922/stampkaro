import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy | StampKaro", description: "How StampKaro handles account and loyalty information." };

export default function PrivacyPage() {
  return <main className="px-5 py-16"><article className="prose prose-slate mx-auto max-w-3xl"><h1 className="font-heading text-4xl font-bold">Privacy policy</h1><p className="mt-3 text-sm text-muted-foreground">Last updated: 12 October 2026</p><h2>Information we process</h2><p>StampKaro processes account details, business profiles, loyalty-card activity, redemption records, and location coordinates only when a business enables location verification.</p><h2>How information is used</h2><p>We use this information to operate loyalty programs, prevent fraudulent scans, provide business analytics, and maintain account security.</p><h2>Sharing and retention</h2><p>We do not sell personal information. Data is shared only with service providers needed to operate StampKaro or when required by law. Records are retained only as long as required for the service, security, and legal obligations.</p><h2>Your choices</h2><p>You may request access, correction, or deletion of your information by contacting hello@stampkaro.in. Some transaction records may need to be retained where legally required.</p></article></main>;
}
