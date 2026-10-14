"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/utils/api-client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Plan } from "@/types/models";

type BusinessRow = { id: string; name: string; ownerId: string; plan: Plan; maxBranches: number; trialEndsAt?: string; planExpiresAt?: string };
export function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]); const [loading, setLoading] = useState(true);
  async function load() { try { const result = await api<{ businesses: BusinessRow[] }>("/api/admin/businesses"); setBusinesses(result.businesses); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not load businesses"); } finally { setLoading(false); } }
  useEffect(() => { void load(); }, []);
  async function update(id: string, plan: Plan) { try { await api(`/api/admin/businesses/${id}`, { method: "PATCH", body: JSON.stringify({ plan }) }); await load(); toast.success("Plan updated"); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not update plan"); } }
  return <main className="mx-auto min-h-screen max-w-7xl px-5 py-10"><div className="flex items-end justify-between"><div><p className="font-semibold text-primary">Platform operations</p><h1 className="font-heading text-3xl font-bold">Businesses</h1></div><Building2 className="size-9 text-primary" /></div><div className="mt-8 overflow-hidden rounded-2xl border bg-white"><Table><TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Plan</TableHead><TableHead>Branches</TableHead><TableHead>Owner ID</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{businesses.map((business) => <TableRow key={business.id}><TableCell className="font-medium">{business.name}</TableCell><TableCell>{business.plan}</TableCell><TableCell>{business.maxBranches}</TableCell><TableCell className="max-w-40 truncate font-mono text-xs">{business.ownerId}</TableCell><TableCell><select className="rounded-lg border bg-background px-3 py-2 text-sm" value={business.plan} onChange={(event) => update(business.id, event.target.value as Plan)}><option value="trial">Trial</option><option value="basic">Basic</option><option value="growth">Growth</option><option value="pro">Pro</option><option value="enterprise">Enterprise</option></select></TableCell></TableRow>)}{!businesses.length && <TableRow><TableCell colSpan={5} className="h-40 text-center">{loading ? "Loading…" : "No businesses found"}</TableCell></TableRow>}</TableBody></Table></div><Button className="mt-5" variant="outline" onClick={load}>Refresh</Button></main>;
}
