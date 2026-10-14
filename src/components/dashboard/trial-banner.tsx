"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import type { Business } from "@/types/models";
import { buttonVariants } from "@/components/ui/button";

export function TrialBanner({ business }: { business: Business }) {
  if (business.plan !== "trial") return null;
  const days = Math.max(0, Math.ceil((business.trialEndsAt.toMillis() - Date.now()) / 86_400_000));
  return <div className={`mb-6 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between ${days ? "bg-amber-50 text-amber-950" : "bg-red-50 text-red-950"}`}><div className="flex items-center gap-3"><Clock3 /><div><p className="font-semibold">{days ? `${days} trial ${days === 1 ? "day" : "days"} remaining` : "Your trial has ended"}</p><p className="text-sm opacity-75">Choose a plan to keep collecting customer stamps.</p></div></div><Link className={buttonVariants({ size: "sm" })} href="/pricing">View plans</Link></div>;
}
