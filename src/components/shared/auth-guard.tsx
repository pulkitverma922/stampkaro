"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types/models";

export function AuthGuard({ children, roles }: { children: ReactNode; roles?: Role[] }) {
  const { user, profile, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!profile) {
      router.replace("/onboarding");
      return;
    }
    if (roles && role && !roles.includes(role) && role !== "admin") {
      router.replace(role === "customer" ? "/wallet" : "/dashboard");
    }
  }, [loading, pathname, profile, role, roles, router, user]);

  if (loading || !user || !profile || (roles && role && !roles.includes(role) && role !== "admin")) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-primary" aria-label="Loading" />
      </main>
    );
  }

  return children;
}
