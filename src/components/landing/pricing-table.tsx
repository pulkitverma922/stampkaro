import { Check } from "lucide-react";
import { PLANS } from "@/config/plans";
import { PlanAction } from "@/components/landing/plan-action";
import { cn } from "@/lib/utils";

export function PricingTable({ compact = false }: { compact?: boolean }) {
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        {!compact && <div className="mx-auto max-w-2xl text-center"><p className="font-semibold text-primary">Simple pricing</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Choose the plan that fits today</h2><p className="mt-4 text-muted-foreground">Start with a free three-day trial and upgrade when you are ready.</p></div>}
        <div className={cn("grid gap-6 lg:grid-cols-3", !compact && "mt-12")}>{PLANS.map((plan) => <article key={plan.id} className={cn("relative flex flex-col rounded-2xl border bg-card p-7 shadow-sm", "popular" in plan && plan.popular && "border-primary shadow-lg shadow-orange-100")}>
          {"popular" in plan && plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">Most popular</span>}
          <h3 className="font-heading text-xl font-semibold">{plan.name}</h3><p className="mt-4"><span className="font-heading text-4xl font-bold">₹{(plan.pricePaise / 100).toLocaleString("en-IN")}</span><span className="text-muted-foreground"> / month</span></p><p className="mt-2 text-sm text-muted-foreground">Up to {plan.maxBranches} {plan.maxBranches === 1 ? "location" : "locations"}</p>
          <ul className="my-7 flex-1 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />{feature}</li>)}</ul><PlanAction planId={plan.id} popular={"popular" in plan && Boolean(plan.popular)} />
        </article>)}</div>
      </div>
    </section>
  );
}
