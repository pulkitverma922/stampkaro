import type { ReactNode } from "react";
import { Footer } from "@/components/landing/footer";
import { MarketingHeader } from "@/components/landing/marketing-header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <><MarketingHeader />{children}<Footer /></>;
}
