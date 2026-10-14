"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { WalletCards } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { StampCard } from "@/components/customer/stamp-card";
import type { Card } from "@/types/models";

export function WalletList() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  useEffect(() => {
    if (!user) return;
    return onSnapshot(query(collection(db, "cards"), where("customerId", "==", user.uid), orderBy("lastScanAt", "desc"), limit(30)), (snapshot) => setCards(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Card)));
  }, [user]);
  return <main className="mx-auto min-h-screen max-w-5xl px-5 py-10"><div className="flex items-end justify-between"><div><p className="font-semibold text-primary">Your rewards</p><h1 className="font-heading text-3xl font-bold">Stamp wallet</h1></div><WalletCards className="size-9 text-primary" /></div>{cards.length ? <div className="mt-8 grid gap-6 md:grid-cols-2">{cards.map((card) => <Link key={card.id} href={`/wallet/${card.bizId}`} className="transition hover:-translate-y-1"><StampCard businessName={card.businessName} stamps={card.stamps} requiredStamps={card.requiredStamps} status={card.status} /></Link>)}</div> : <section className="mt-12 rounded-3xl border border-dashed p-12 text-center"><WalletCards className="mx-auto size-12 text-muted-foreground" /><h2 className="mt-4 font-heading text-xl font-semibold">Your first stamp is waiting</h2><p className="mt-2 text-muted-foreground">Scan a StampKaro QR at a participating business to add your first card.</p></section>}</main>;
}
