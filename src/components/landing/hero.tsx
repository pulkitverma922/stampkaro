import Link from "next/link";
import { ArrowRight, Check, Gift, QrCode, Stamp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-orange-50 via-white to-white px-5 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-primary">Built for local businesses</span>
          <h1 className="mt-6 font-heading text-5xl font-bold leading-tight tracking-tight sm:text-6xl">Turn every visit into a reason to return.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">StampKaro gives your customers a digital loyalty card through one simple QR scan. No app, no paper card, no complicated setup.</p>
          <p className="mt-4 font-heading text-xl font-semibold text-primary">Har visit pe stamp, har stamp pe reward.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className={buttonVariants({ size: "lg" })} href="/login?type=owner">Start your free trial <ArrowRight /></Link><Link className={buttonVariants({ size: "lg", variant: "outline" })} href="#how-it-works">See how it works</Link></div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Check className="size-4 text-emerald-500" /> No credit card</span><span className="flex items-center gap-1"><Check className="size-4 text-emerald-500" /> Live in minutes</span><span className="flex items-center gap-1"><Check className="size-4 text-emerald-500" /> No customer app</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-8 rounded-full bg-orange-200/50 blur-3xl" />
          <div className="relative rounded-[2rem] border bg-white p-6 shadow-2xl shadow-orange-200">
            <div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Your loyalty card</p><h2 className="font-heading text-2xl font-bold">Morning Brew Cafe</h2></div><QrCode className="size-10 text-primary" /></div>
            <div className="my-8 grid grid-cols-4 gap-4">{Array.from({ length: 8 }, (_, index) => <span key={index} className={`flex aspect-square items-center justify-center rounded-full border-2 ${index < 6 ? "border-primary bg-primary text-white" : "border-dashed border-orange-200 text-orange-300"}`}><Stamp className="size-5" /></span>)}</div>
            <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 text-amber-950"><Gift className="size-8 text-amber-500" /><div><p className="font-semibold">2 more visits to go</p><p className="text-sm">Your free coffee is getting closer.</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
