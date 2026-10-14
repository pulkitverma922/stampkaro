"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/utils/api-client";
import { Button } from "@/components/ui/button";

export function PlanAction({ planId, popular }: { planId: "basic" | "growth" | "pro"; popular: boolean }) {
  const router = useRouter(); const { user, profile, role } = useAuth(); const [loading, setLoading] = useState(false);
  async function choose() {
    if (!user) { router.push("/login?type=owner"); return; }
    if (!profile || role === "customer") { router.push("/onboarding"); return; }
    const bizId = profile.ownedBusinessIds?.[0]; if (!bizId) { router.push("/onboarding"); return; }
    setLoading(true);
    try {
      const order = await api<{ orderId: string; amount: number; currency: string; keyId: string; planName: string }>("/api/billing/order", { method: "POST", body: JSON.stringify({ bizId, planId }) });
      if (!("Razorpay" in window)) { const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.async = true; await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error("Could not load checkout")); document.head.appendChild(script); }); }
      const RazorpayConstructor = (window as unknown as { Razorpay: new (options: object) => { open(): void } }).Razorpay;
      new RazorpayConstructor({ key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId, name: "StampKaro", description: `${order.planName} annual plan`, handler: () => { toast.success("Payment received. Your plan will update shortly."); router.push("/dashboard"); }, prefill: { email: profile.email } }).open();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not start checkout"); } finally { setLoading(false); }
  }
  return <Button variant={popular ? "default" : "outline"} onClick={choose} disabled={loading}>{loading ? "Opening checkout…" : user && role !== "customer" ? "Choose plan" : "Start free"}</Button>;
}
