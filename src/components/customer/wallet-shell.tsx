"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Gift, Home, LogOut, Sparkles, UserRound } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [{ href: "/wallet", label: "Wallet", icon: Gift }, { href: "/wallet/scratch", label: "Surprises", icon: Sparkles }];

export function WalletShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const { profile, signOut } = useAuth();
  async function logout() { await signOut(); router.replace("/"); }
  return <div className="min-h-screen bg-background"><header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"><Logo /><nav className="hidden items-center gap-2 sm:flex">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary", pathname === href && "bg-secondary text-secondary-foreground")}><Icon className="size-4" />{label}</Link>)}</nav><div className="flex items-center gap-2"><span className="hidden items-center gap-2 text-sm font-medium md:flex"><UserRound className="size-4 text-primary" />{profile?.displayName}</span><Button variant="ghost" size="icon" onClick={logout} aria-label="Log out"><LogOut /></Button></div></div></header>{children}<nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t bg-background/95 px-3 backdrop-blur sm:hidden">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("flex min-w-20 flex-col items-center gap-1 text-xs font-medium text-muted-foreground", pathname === href && "text-primary")}><Icon className="size-5" />{label}</Link>)}<Link href="/" className="flex min-w-20 flex-col items-center gap-1 text-xs font-medium text-muted-foreground"><Home className="size-5" />Home</Link></nav></div>;
}
