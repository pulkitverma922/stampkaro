"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { ScratchCard } from "@/components/customer/scratch-card";
import type { ScratchCard as ScratchCardDoc } from "@/types/models";

type CardWithBusiness = ScratchCardDoc & { businessName?: string };
export function ScratchWallet() {
  const { user } = useAuth(); const [cards, setCards] = useState<CardWithBusiness[]>([]);
  useEffect(() => { if (user) return onSnapshot(query(collection(db, "scratchCards"), where("customerId", "==", user.uid), orderBy("createdAt", "desc"), limit(30)), (snapshot) => setCards(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as CardWithBusiness))); }, [user]);
  return <main className="mx-auto min-h-screen max-w-5xl px-5 py-10"><div className="flex items-end justify-between"><div><p className="font-semibold text-primary">Bonus moments</p><h1 className="font-heading text-3xl font-bold">Scratch cards</h1></div><Sparkles className="size-9 text-amber-500" /></div><div className="mt-8 grid gap-6 md:grid-cols-2">{cards.map((card) => <ScratchCard key={card.id} id={card.id} businessName={card.businessName ?? "StampKaro business"} revealed={card.revealed} initialPrize={card.prizeLabel} />)}{!cards.length && <p className="col-span-full rounded-3xl border border-dashed p-12 text-center text-muted-foreground">Surprise scratch cards from your visits will appear here.</p>}</div></main>;
}
