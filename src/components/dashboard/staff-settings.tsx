"use client";

import { useEffect, useState, type FormEvent } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/utils/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StaffMember = { id: string; email: string };

export function StaffSettings() {
  const { profile } = useAuth(); const bizId = profile?.ownedBusinessIds?.[0];
  const [staff, setStaff] = useState<StaffMember[]>([]); const [email, setEmail] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { if (bizId) return onSnapshot(query(collection(db, "businesses", bizId, "staff"), orderBy("addedAt", "desc")), (snapshot) => setStaff(snapshot.docs.map((item) => ({ id: item.id, email: item.get("email") })))); }, [bizId]);
  async function invite(event: FormEvent) { event.preventDefault(); if (!bizId) return; setSaving(true); try { await api(`/api/business/${bizId}/staff`, { method: "POST", body: JSON.stringify({ email }) }); setEmail(""); toast.success("Staff access added"); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not add staff"); } finally { setSaving(false); } }
  return <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8"><p className="font-semibold text-primary">Team access</p><h1 className="font-heading text-3xl font-bold">Staff settings</h1><p className="mt-2 text-muted-foreground">Staff can view and confirm rewards for this business.</p><section className="mt-8 rounded-3xl border bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><UserPlus className="text-primary" /><h2 className="font-heading text-xl font-bold">Add staff member</h2></div><form onSubmit={invite} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"><div className="flex-1 space-y-2"><Label htmlFor="staffEmail">Their StampKaro account email</Label><Input id="staffEmail" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="team@example.com" /></div><Button disabled={saving}>{saving ? "Adding…" : "Add staff"}</Button></form><p className="mt-3 text-xs text-muted-foreground">For security, the person must create a StampKaro account before you add them.</p></section><section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><Users className="text-primary" /><h2 className="font-heading text-xl font-bold">Current team</h2></div><div className="mt-5 divide-y">{staff.length ? staff.map((member) => <div key={member.id} className="flex items-center justify-between py-4"><span>{member.email}</span><span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">Staff</span></div>) : <p className="py-8 text-center text-sm text-muted-foreground">No staff members yet.</p>}</div></section></main>;
}
