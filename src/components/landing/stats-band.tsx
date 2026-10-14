const stats = [{ value: "No app", label: "for customers to install" }, { value: "1 QR", label: "for every business" }, { value: "Real time", label: "wallet and redemption updates" }, { value: "3 days", label: "to explore every core feature" }];

export function StatsBand() {
  return <section className="border-y bg-orange-50 px-5 py-10"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4">{stats.map((stat) => <div key={stat.value} className="text-center"><p className="font-heading text-2xl font-bold text-primary sm:text-3xl">{stat.value}</p><p className="mt-1 text-sm text-muted-foreground">{stat.label}</p></div>)}</div></section>;
}
