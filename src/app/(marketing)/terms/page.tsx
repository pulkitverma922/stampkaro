import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms | StampKaro", description: "Terms for businesses and customers using StampKaro." };

export default function TermsPage() {
  return <main className="px-5 py-16"><article className="prose prose-slate mx-auto max-w-3xl"><h1 className="font-heading text-4xl font-bold">Terms of service</h1><p className="mt-3 text-sm text-muted-foreground">Last updated: 12 October 2026</p><h2>Using StampKaro</h2><p>You must provide accurate account information, keep access credentials secure, and use the service only for lawful loyalty programs and genuine customer visits.</p><h2>Business responsibilities</h2><p>Businesses are responsible for clearly describing rewards, honoring valid redemptions, training staff, and complying with consumer, tax, and privacy laws that apply to their operations.</p><h2>Fair use</h2><p>Attempts to manipulate stamps, bypass visit controls, disrupt the platform, or access another account are prohibited and may result in suspension.</p><h2>Availability and changes</h2><p>We work to keep StampKaro reliable but cannot guarantee uninterrupted availability. Features and plan limits may change with reasonable notice.</p><h2>Contact</h2><p>Questions about these terms can be sent to hello@stampkaro.in.</p></article></main>;
}
