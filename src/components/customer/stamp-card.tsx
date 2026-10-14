"use client";

import { motion } from "framer-motion";
import { Gift, Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StampCard({ businessName, stamps, requiredStamps, status, brandColor = "#FF7A00", className }: { businessName: string; stamps: number; requiredStamps: number; status: "active" | "rewardReady"; brandColor?: string; className?: string }) {
  return (
    <article className={cn("overflow-hidden rounded-3xl border bg-card shadow-lg", className)}>
      <div className="p-6 text-white" style={{ background: `linear-gradient(135deg, ${brandColor}, #312e81)` }}><p className="text-sm text-white/75">StampKaro card</p><h2 className="mt-1 font-heading text-2xl font-bold">{businessName}</h2></div>
      <div className="p-6"><div className="grid grid-cols-5 gap-3">{Array.from({ length: requiredStamps }, (_, index) => <motion.span key={index} initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ delay: index * 0.04, type: "spring" }} className={cn("flex aspect-square items-center justify-center rounded-full border-2", index < stamps ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-dashed text-muted-foreground")}><Stamp className="size-4" /></motion.span>)}</div><div className={cn("mt-6 flex items-center gap-3 rounded-2xl p-4", status === "rewardReady" ? "bg-amber-50 text-amber-950" : "bg-muted")}><Gift className={cn("size-6", status === "rewardReady" ? "text-amber-500" : "text-primary")} /><p className="font-medium">{status === "rewardReady" ? "Your reward is ready!" : `${requiredStamps - stamps} more ${requiredStamps - stamps === 1 ? "visit" : "visits"} to your reward`}</p></div></div>
    </article>
  );
}
