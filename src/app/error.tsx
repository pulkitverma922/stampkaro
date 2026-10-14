"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("StampKaro route error", { message: error.message, digest: error.digest }); }, [error]);
  return <main className="flex min-h-[70vh] items-center justify-center px-5"><section className="max-w-md text-center"><AlertTriangle className="mx-auto size-12 text-amber-500" /><h1 className="mt-5 font-heading text-3xl font-bold">Something went wrong</h1><p className="mt-3 text-muted-foreground">We could not load this part of StampKaro. Your data is safe—please try again.</p><Button className="mt-6" onClick={reset}>Try again</Button></section></main>;
}
