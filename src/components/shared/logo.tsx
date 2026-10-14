import Link from "next/link";
import { Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 font-heading text-xl font-bold", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Stamp className="size-5" aria-hidden="true" />
      </span>
      StampKaro
    </Link>
  );
}
