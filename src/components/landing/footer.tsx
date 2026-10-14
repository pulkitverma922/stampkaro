import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Har visit pe stamp, har stamp pe reward. Simple digital loyalty for India&apos;s local businesses.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Footer navigation">
          <Link href="/pricing">Pricing</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link>
        </nav>
      </div>
      <p className="border-t px-5 py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} StampKaro. All rights reserved.</p>
    </footer>
  );
}
