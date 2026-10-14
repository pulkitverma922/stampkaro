"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { CheckCircle2, Clock3, Gift } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/utils/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Redemption } from "@/types/models";

type QueueItem = Redemption & { customerName?: string; businessName?: string };

export function RedemptionQueue() {
  const { profile } = useAuth();
  const bizId = profile?.ownedBusinessIds?.[0] ?? profile?.staffBusinessIds?.[0];
  const [items, setItems] = useState<QueueItem[]>([]);
  const [code, setCode] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  useEffect(() => {
    if (!bizId) return;
    return onSnapshot(query(collection(db, "redemptions"), where("bizId", "==", bizId), where("status", "==", "pending"), orderBy("createdAt", "desc"), limit(50)), (snapshot) => setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as QueueItem)));
  }, [bizId]);
  async function confirm(body: { redemptionId: string } | { bizId: string; code: string }, key: string) { setConfirming(key); try { await api("/api/redeem/confirm", { method: "POST", body: JSON.stringify(body) }); toast.success("Reward confirmed"); setCode(""); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not confirm reward"); } finally { setConfirming(null); } }
  return <main className="mx-auto min-h-screen max-w-5xl px-5 py-10"><div><p className="font-semibold text-primary">Live queue</p><h1 className="font-heading text-3xl font-bold">Reward redemptions</h1><p className="mt-2 text-muted-foreground">Confirm the customer&apos;s six-digit code after handing over the reward.</p></div>{bizId && <div className="mt-8 flex max-w-md gap-3"><Input inputMode="numeric" maxLength={6} placeholder="Enter 6-digit code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} /><Button disabled={code.length !== 6 || confirming === code} onClick={() => confirm({ bizId, code }, code)}>Confirm</Button></div>}<div className="mt-10 space-y-4">{items.length ? items.map((item) => <article key={item.id} className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><span className="flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><Gift /></span><div><h2 className="font-semibold">{item.customerName ?? "Customer"}</h2><p className="font-mono text-2xl font-bold tracking-widest text-primary">{item.code}</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" /> Expires {item.expiresAt.toDate().toLocaleTimeString()}</p></div></div><Button onClick={() => confirm({ redemptionId: item.id }, item.id)} disabled={confirming === item.id}><CheckCircle2 /> Confirm reward</Button></article>) : <div className="rounded-3xl border border-dashed p-12 text-center"><CheckCircle2 className="mx-auto size-12 text-emerald-500" /><h2 className="mt-4 font-heading text-xl font-semibold">All caught up</h2><p className="mt-2 text-muted-foreground">New redemption requests will appear here instantly.</p></div>}</div></main>;
}
