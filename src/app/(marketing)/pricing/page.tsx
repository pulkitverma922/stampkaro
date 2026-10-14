import type { Metadata } from "next";
import { PricingTable } from "@/components/landing/pricing-table";

export const metadata: Metadata = { title: "Pricing | StampKaro", description: "Simple digital loyalty plans for businesses of every size." };

export default function PricingPage() {
  return <main><section className="bg-orange-50 px-5 py-16 text-center"><h1 className="font-heading text-4xl font-bold sm:text-5xl">Plans that grow with your regulars</h1><p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Start free, learn what brings customers back, and upgrade when you need more locations and engagement tools.</p></section><PricingTable compact /></main>;
}
