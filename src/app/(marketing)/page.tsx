import { Faq } from "@/components/landing/faq";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { AnimatedHero } from "@/components/landing/animated-hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PricingTable } from "@/components/landing/pricing-table";
import { StatsBand } from "@/components/landing/stats-band";

export default function Home() {
  return <main><AnimatedHero /><StatsBand /><FeatureGrid /><HowItWorks /><PricingTable /><Faq /></main>;
}
