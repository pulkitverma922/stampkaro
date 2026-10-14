import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Contact | StampKaro", description: "Talk to StampKaro about digital loyalty for your business." };

export default function ContactPage() {
  return <main className="px-5 py-20"><section className="mx-auto max-w-2xl rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-12"><Mail className="mx-auto size-12 text-primary" /><h1 className="mt-6 font-heading text-4xl font-bold">Let&apos;s help customers return</h1><p className="mt-4 leading-7 text-muted-foreground">Have a question about launching StampKaro for your business? Email us and tell us about your locations and loyalty goals.</p><Link className={`${buttonVariants()} mt-8`} href="mailto:hello@stampkaro.in">hello@stampkaro.in</Link></section></main>;
}
