"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Clock3, Gift } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/utils/api-client";
import { StampCard } from "@/components/customer/stamp-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Card } from "@/types/models";

type RedemptionResult = { code: string; expiresAt: string };

export function CardDetail({ bizId }: { bizId: string }) {
  const { user } = useAuth();
  const [card, setCard] = useState<Card | null>(null);
  const [redemption, setRedemption] = useState<RedemptionResult | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (user) return onSnapshot(doc(db, "cards", `${user.uid}_${bizId}`), (snapshot) => setCard(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Card) : null)); }, [bizId, user]);
  async function redeem() { if (!card) return; setLoading(true); try { setRedemption(await api<RedemptionResult>("/api/redeem", { method: "POST", body: JSON.stringify({ cardId: card.id }) })); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not create redemption"); } finally { setLoading(false); } }
  return <main className="mx-auto min-h-screen max-w-xl px-5 py-10">{card ? <><StampCard businessName={card.businessName} stamps={card.stamps} requiredStamps={card.requiredStamps} status={card.status} /><div className="mt-6 rounded-2xl border p-5"><div className="flex items-center gap-3"><Clock3 className="text-primary" /><div><p className="font-semibold">Lifetime rewards</p><p className="text-sm text-muted-foreground">{card.completedCount} rewards redeemed</p></div></div></div>{card.status === "rewardReady" && <Button size="lg" className="mt-6 w-full" onClick={redeem} disabled={loading}><Gift /> {loading ? "Preparing reward…" : "Redeem reward"}</Button>}</> : <p className="text-center text-muted-foreground">Loading your loyalty card…</p>}<Dialog open={Boolean(redemption)} onOpenChange={(open) => !open && setRedemption(null)}><DialogContent className="text-center"><DialogHeader><DialogTitle className="font-heading text-2xl">Show this code to staff</DialogTitle><DialogDescription>The code expires in 10 minutes and can only be used once.</DialogDescription></DialogHeader><p className="my-6 font-mono text-5xl font-bold tracking-[0.2em] text-primary">{redemption?.code}</p><p className="text-sm text-muted-foreground">Valid until {redemption && new Date(redemption.expiresAt).toLocaleTimeString()}</p></DialogContent></Dialog></main>;
}
