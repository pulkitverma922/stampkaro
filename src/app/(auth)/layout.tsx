import type { ReactNode } from "react";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9ff] px-4 py-8">
      <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-orange-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 size-[28rem] rounded-full bg-amber-200/35 blur-3xl" />
      <div className="relative mx-auto max-w-md">
        <Logo className="mb-8 justify-center" />
        {children}
      </div>
    </main>
  );
}
