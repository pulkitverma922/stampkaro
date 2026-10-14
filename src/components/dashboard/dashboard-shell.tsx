"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { BarChart3, Gift, Menu, QrCode, Settings, Store, Users, WalletCards } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { AccountActions } from "@/components/shared/account-actions";
import { cn } from "@/lib/utils";

const ownerOnlyRoutes = ["/dashboard/rewards", "/dashboard/qr", "/dashboard/branches", "/dashboard/menu", "/dashboard/settings"];

const navigation = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/redemptions", label: "Redemptions", icon: WalletCards },
  { href: "/dashboard/rewards", label: "Rewards", icon: Gift },
  { href: "/dashboard/qr", label: "QR code", icon: QrCode },
  { href: "/dashboard/branches", label: "Branches", icon: Store },
  { href: "/dashboard/menu", label: "Menu", icon: Menu },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuth();
  useEffect(() => { if (role === "staff" && ownerOnlyRoutes.some((path) => pathname.startsWith(path))) router.replace("/dashboard/redemptions"); }, [pathname, role, router]);
  const visibleNavigation = role === "staff" ? navigation.filter((item) => ["/dashboard", "/dashboard/customers", "/dashboard/redemptions"].includes(item.href)) : navigation;
  return <div className="min-h-screen bg-slate-50"><header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur md:hidden"><div className="flex h-16 items-center justify-between px-4"><Logo /><AccountActions /></div></header><aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-[#0F5132] text-white md:flex md:flex-col"><div className="p-6"><Logo className="text-white" /></div><nav className="flex-1 space-y-1 px-3">{visibleNavigation.map(({ href, label, icon: Icon }) => { const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href)); return <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white", active && "bg-orange-600 text-white shadow-lg shadow-orange-950/30")}><Icon className="size-5" />{label}</Link>; })}</nav><div className="border-t border-white/10 p-4"><AccountActions /></div></aside><div className="pb-20 md:ml-64 md:pb-0">{children}</div><nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t bg-white px-2 md:hidden">{visibleNavigation.slice(0, 5).map(({ href, label, icon: Icon }) => { const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href)); return <Link key={href} href={href} className={cn("flex min-w-14 flex-col items-center gap-1 text-[10px] font-medium text-muted-foreground", active && "text-primary")}><Icon className="size-5" />{label}</Link>; })}</nav></div>;
}

