"use client";

import { motion } from "framer-motion";
import { BarChart3, Gift, MapPin, QrCode, Smartphone, Users } from "lucide-react";

const features = [
  { icon: QrCode, title: "One QR, instant stamps", description: "Place one QR at your counter. Customers scan, sign in, and receive their stamp in seconds." },
  { icon: Smartphone, title: "Nothing to download", description: "The entire experience works in the browser, removing the biggest barrier to loyalty adoption." },
  { icon: Gift, title: "Rewards they remember", description: "Create simple visit-based rewards and optional surprise scratch-card moments." },
  { icon: BarChart3, title: "Useful daily insights", description: "See visits, returning customers, and redemptions without wrestling with spreadsheets." },
  { icon: MapPin, title: "Ready for every branch", description: "Manage multiple locations and use optional GPS checks to keep scans genuine." },
  { icon: Users, title: "Built for your team", description: "Give staff controlled access to confirm rewards while you stay in charge." },
];

export function FeatureGrid() {
  return (
    <section id="features" className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center"><p className="font-semibold text-primary">Everything you need</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Loyalty that feels effortless</h2><p className="mt-4 text-muted-foreground">Keep the experience simple for customers and useful for your business.</p></div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, description }, index) => <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .06 }} whileHover={{ y: -6 }} key={title} className="rounded-3xl border border-orange-100 bg-white p-7 shadow-[0_12px_40px_-24px_rgba(91,33,182,.45)]"><span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-emerald-50 text-primary"><Icon className="size-6" /></span><h3 className="font-heading text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></motion.article>)}</div>
      </div>
    </section>
  );
}
