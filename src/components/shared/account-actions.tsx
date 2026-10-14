"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccountActions() {
  const router = useRouter();
  const { user, profile, role, loading, signOut } = useAuth();
  if (loading) return <span className="h-9 w-28 animate-pulse rounded-full bg-muted" />;
  if (!user) return <div className="flex items-center gap-2"><Link className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")} href="/login">Sign in</Link><Link className={buttonVariants()} href="/login?type=owner">Start free</Link></div>;
  const destination = !profile ? "/onboarding" : role === "customer" ? "/wallet" : role === "admin" ? "/admin" : "/dashboard";
  return <div className="flex items-center gap-2"><Link className={buttonVariants()} href={destination}>{role === "customer" ? <WalletCards /> : <LayoutDashboard />}{!profile ? "Finish setup" : role === "customer" ? "My wallet" : "Dashboard"}</Link><Button variant="ghost" size="icon" aria-label="Sign out" onClick={async () => { await signOut(); router.push("/"); }}><LogOut /></Button></div>;
}
