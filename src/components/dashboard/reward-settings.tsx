"use client";

import { useEffect, useState, type FormEvent } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Gift, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/utils/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Business } from "@/types/models";

export function RewardSettings() {
  const { profile } = useAuth(); const bizId = profile?.ownedBusinessIds?.[0];
  const [business, setBusiness] = useState<Business | null>(null); const [saving, setSaving] = useState(false);
  useEffect(() => { if (bizId) return onSnapshot(doc(db, "businesses", bizId), (snapshot) => setBusiness(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Business) : null)); }, [bizId]);
  async function save(event: FormEvent) { event.preventDefault(); if (!business || !bizId) return; setSaving(true); try { await api(`/api/business/${bizId}`, { method: "PATCH", body: JSON.stringify({ reward: business.reward, rules: business.rules }) }); toast.success("Reward program updated"); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not save settings"); } finally { setSaving(false); } }
  if (!business) return <main className="p-8 text-muted-foreground">Loading reward program…</main>;
  return <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8"><p className="font-semibold text-primary">Program design</p><h1 className="font-heading text-3xl font-bold">Rewards & visit rules</h1><form onSubmit={save} className="mt-8 grid gap-6 lg:grid-cols-2"><section className="rounded-3xl border bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><Gift className="text-primary" /><h2 className="font-heading text-xl font-bold">Customer reward</h2></div><div className="mt-6 space-y-5"><div className="space-y-2"><Label htmlFor="title">Reward title</Label><Input id="title" value={business.reward.title} onChange={(event) => setBusiness({ ...business, reward: { ...business.reward, title: event.target.value } })} /></div><div className="space-y-2"><Label htmlFor="stamps">Stamps required</Label><Input id="stamps" type="number" min={3} max={20} value={business.reward.requiredStamps} onChange={(event) => setBusiness({ ...business, reward: { ...business.reward, requiredStamps: Number(event.target.value) } })} /></div></div></section><section className="rounded-3xl border bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><ShieldCheck className="text-primary" /><h2 className="font-heading text-xl font-bold">Visit protection</h2></div><div className="mt-6 space-y-5"><div className="space-y-2"><Label htmlFor="cooldown">Cooldown hours</Label><Input id="cooldown" type="number" min={0} max={168} value={business.rules.cooldownHours} onChange={(event) => setBusiness({ ...business, rules: { ...business.rules, cooldownHours: Number(event.target.value) } })} /></div><div className="space-y-2"><Label htmlFor="daily">Maximum scans per day</Label><Input id="daily" type="number" min={1} max={20} value={business.rules.maxScansPerDay} onChange={(event) => setBusiness({ ...business, rules: { ...business.rules, maxScansPerDay: Number(event.target.value) } })} /></div><label className="flex items-center gap-3 rounded-xl bg-muted p-4"><input type="checkbox" checked={business.rules.gpsRequired} onChange={(event) => setBusiness({ ...business, rules: { ...business.rules, gpsRequired: event.target.checked } })} /><span><strong className="block">Require location</strong><span className="text-sm text-muted-foreground">Confirm customers are near a branch.</span></span></label></div></section><Button className="lg:col-span-2" size="lg" disabled={saving}>{saving ? "Saving…" : "Save reward program"}</Button></form></main>;
}
