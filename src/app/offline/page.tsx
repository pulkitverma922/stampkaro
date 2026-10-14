import Link from "next/link";
import { WifiOff } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function OfflinePage() {
  return <main className="flex min-h-screen items-center justify-center px-5"><section className="max-w-md text-center"><span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-orange-100 text-primary"><WifiOff className="size-8" /></span><h1 className="mt-6 font-heading text-3xl font-bold">You&apos;re offline</h1><p className="mt-3 text-muted-foreground">Reconnect to collect stamps, redeem rewards, or update your business. Pages you recently viewed may remain available.</p><Link href="/" className={`${buttonVariants()} mt-7`}>Try again</Link></section></main>;
}
