"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, startAfter, where, type QueryDocumentSnapshot } from "firebase/firestore";
import { Users } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Card } from "@/types/models";

const PAGE_SIZE = 20;

export function CustomersTable() {
  const { profile } = useAuth();
  const bizId = profile?.ownedBusinessIds?.[0] ?? profile?.staffBusinessIds?.[0];
  const [cards, setCards] = useState<Card[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot | null>(null);
  const [lastDocument, setLastDocument] = useState<QueryDocumentSnapshot | null>(null);
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (!bizId) return;
    const constraints = [where("bizId", "==", bizId), orderBy("lastScanAt", "desc"), ...(cursor ? [startAfter(cursor)] : []), limit(PAGE_SIZE)];
    return onSnapshot(query(collection(db, "cards"), ...constraints), (snapshot) => { setCards(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Card)); setLastDocument(snapshot.docs.at(-1) ?? null); });
  }, [bizId, cursor, page]);
  return <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8"><div className="flex items-end justify-between"><div><p className="font-semibold text-primary">Relationships</p><h1 className="font-heading text-3xl font-bold">Customers</h1><p className="mt-2 text-muted-foreground">Your most recent loyalty customers, 20 at a time.</p></div><Users className="size-9 text-primary" /></div><div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm"><Table><TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Stamps</TableHead><TableHead>Status</TableHead><TableHead>Rewards</TableHead><TableHead>Last visit</TableHead></TableRow></TableHeader><TableBody>{cards.map((card) => <TableRow key={card.id}><TableCell className="font-medium">{card.customerName}</TableCell><TableCell>{card.stamps}/{card.requiredStamps}</TableCell><TableCell><Badge variant={card.status === "rewardReady" ? "default" : "secondary"}>{card.status === "rewardReady" ? "Reward ready" : "Active"}</Badge></TableCell><TableCell>{card.completedCount}</TableCell><TableCell>{card.lastScanAt.toDate().toLocaleDateString("en-IN")}</TableCell></TableRow>)}{!cards.length && <TableRow><TableCell colSpan={5} className="h-40 text-center text-muted-foreground">Customers will appear after their first scan.</TableCell></TableRow>}</TableBody></Table></div><div className="mt-5 flex justify-end gap-3"><Button variant="outline" disabled={page === 0} onClick={() => { setPage(0); setCursor(null); }}>First page</Button><Button disabled={cards.length < PAGE_SIZE || !lastDocument} onClick={() => { setCursor(lastDocument); setPage((value) => value + 1); }}>Next 20</Button></div></main>;
}
