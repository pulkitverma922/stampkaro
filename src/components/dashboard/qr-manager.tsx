"use client";

import { useEffect, useRef, useState } from "react";
import { collection, doc, limit, onSnapshot, query, where } from "firebase/firestore";
import QRCode from "qrcode";
import { Download, Printer, QrCode as QrIcon } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import type { Business } from "@/types/models";

export function QrManager() {
  const { profile } = useAuth(); const bizId = profile?.ownedBusinessIds?.[0];
  const canvasRef = useRef<HTMLCanvasElement>(null); const [business, setBusiness] = useState<Business | null>(null); const [qrId, setQrId] = useState(""); const [origin, setOrigin] = useState(process.env.NEXT_PUBLIC_APP_URL ?? "");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  useEffect(() => { if (!bizId) return; const offBusiness = onSnapshot(doc(db, "businesses", bizId), (snapshot) => setBusiness(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Business) : null)); const offQr = onSnapshot(query(collection(db, "qrCodes"), where("bizId", "==", bizId), limit(1)), (snapshot) => setQrId(snapshot.docs[0]?.id ?? "")); return () => { offBusiness(); offQr(); }; }, [bizId]);
  const scanUrl = qrId && origin ? `${origin}/s/${qrId}` : "";
  useEffect(() => { if (canvasRef.current && scanUrl) QRCode.toCanvas(canvasRef.current, scanUrl, { width: 320, margin: 2, color: { dark: "#171126", light: "#ffffff" } }); }, [scanUrl]);
  function download() { const link = document.createElement("a"); link.download = `${business?.slug ?? "stampkaro"}-qr.png`; link.href = canvasRef.current?.toDataURL("image/png") ?? ""; link.click(); }
  return <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8"><p className="font-semibold text-primary">At your counter</p><h1 className="font-heading text-3xl font-bold">Your loyalty QR</h1><p className="mt-2 text-muted-foreground">Print it, display it, and invite customers to scan after every eligible visit.</p><section className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]"><div className="flex flex-col items-center rounded-3xl border bg-white p-7 shadow-sm"><canvas ref={canvasRef} className="max-w-full rounded-2xl" /><p className="mt-4 max-w-full truncate font-mono text-xs text-muted-foreground">{scanUrl}</p><div className="mt-6 flex w-full gap-3"><Button className="flex-1" onClick={download} disabled={!qrId}><Download /> PNG</Button><Button className="flex-1" variant="outline" onClick={() => window.print()} disabled={!qrId}><Printer /> Print poster</Button></div></div><div className="print-poster flex min-h-[540px] flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-orange-700 to-[#0F5132] p-10 text-center text-white shadow-xl"><QrIcon className="size-10 text-amber-400" /><p className="mt-8 text-lg font-semibold">{business?.name}</p><h2 className="mt-4 font-heading text-4xl font-extrabold">Scan. Stamp. Smile.</h2><div className="mt-8 rounded-3xl bg-white p-4"><canvas ref={(node) => { if (node && scanUrl) void QRCode.toCanvas(node, scanUrl, { width: 240, margin: 1 }); }} /></div><p className="mt-7 text-xl font-semibold">{business?.reward.title}</p><p className="mt-2 text-white/70">Collect {business?.reward.requiredStamps} stamps to unlock your reward.</p></div></section></main>;
}
