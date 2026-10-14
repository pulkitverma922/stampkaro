"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Gift, LoaderCircle, MapPin, ScanLine, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/utils/api-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { StampCard } from "@/components/customer/stamp-card";

type QrInfo = { businessName: string; logoUrl: string; brandColor: string; reward: { title: string; requiredStamps: number }; gpsRequired: boolean };
type ScanResult = { card: { stamps: number; requiredStamps: number; status: "active" | "rewardReady"; businessName: string }; rewardUnlocked: boolean; duplicate: boolean };

export function ScanExperience({ qrId }: { qrId: string }) {
  const { user, profile, loading } = useAuth();
  const [info, setInfo] = useState<QrInfo | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => { fetch(`/api/public/qr/${qrId}`).then((response) => response.json()).then((json) => json.ok ? setInfo(json.data) : toast.error(json.error.message)).catch(() => toast.error("Could not load this QR code")); }, [qrId]);

  async function collectStamp() {
    setScanning(true);
    try {
      let coords: { lat?: number; lng?: number } = {};
      if (info?.gpsRequired) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 }));
        coords = { lat: position.coords.latitude, lng: position.coords.longitude };
      }
      setResult(await api<ScanResult>("/api/scan", { method: "POST", body: JSON.stringify({ qrId, ...coords }) }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add your stamp");
    } finally { setScanning(false); }
  }

  return <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white px-5 py-8"><div className="mx-auto max-w-md"><Logo className="mb-8 justify-center" />{!info ? <LoaderCircle className="mx-auto mt-32 size-9 animate-spin text-primary" /> : result ? <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">{result.rewardUnlocked && <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="rounded-3xl bg-amber-100 p-6 text-center text-amber-950"><Sparkles className="mx-auto size-10 text-amber-500" /><h1 className="mt-3 font-heading text-2xl font-bold">Reward unlocked!</h1><p>{info.reward.title} is ready to redeem.</p></motion.div>}<StampCard businessName={result.card.businessName} stamps={result.card.stamps} requiredStamps={result.card.requiredStamps} status={result.card.status} brandColor={info.brandColor} /><Link className={`${buttonVariants()} w-full`} href="/wallet">Open my wallet</Link></motion.div> : <section className="rounded-3xl border bg-card p-7 text-center shadow-xl shadow-orange-100"><span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-orange-100 text-primary"><ScanLine className="size-8" /></span><p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">You&apos;re visiting</p><h1 className="mt-2 font-heading text-3xl font-bold">{info.businessName}</h1><div className="mt-6 rounded-2xl bg-amber-50 p-5"><Gift className="mx-auto size-7 text-amber-500" /><p className="mt-2 font-semibold">Collect {info.reward.requiredStamps} stamps</p><p className="text-sm text-muted-foreground">Unlock {info.reward.title}</p></div>{info.gpsRequired && <p className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" /> Location is checked only for this visit</p>}<div className="mt-7">{loading ? <LoaderCircle className="mx-auto size-7 animate-spin text-primary" /> : !user || !profile ? <Link className={`${buttonVariants({ size: "lg" })} w-full`} href={`/login?next=${encodeURIComponent(`/s/${qrId}`)}`}>Sign in to collect</Link> : profile.role !== "customer" ? <p className="rounded-xl bg-muted p-4 text-sm">Only customer accounts can collect stamps.</p> : <Button size="lg" className="w-full" onClick={collectStamp} disabled={scanning}>{scanning ? <><LoaderCircle className="animate-spin" /> Adding stamp…</> : <><CheckCircle2 /> Collect my stamp</>}</Button>}</div></section>}</div></main>;
}
