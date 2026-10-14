const steps = [
  { number: "01", title: "Create your reward", description: "Tell us about your business and choose what customers unlock after repeat visits." },
  { number: "02", title: "Display your QR", description: "Download your StampKaro poster and place it where customers can scan after purchase." },
  { number: "03", title: "Welcome them back", description: "Customers collect stamps in their wallet and return to redeem rewards with your team." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0F5132] px-5 py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="font-semibold text-orange-300">Three simple steps</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Launch before your next customer arrives</h2></div><div className="mt-12 grid gap-8 md:grid-cols-3">{steps.map((step) => <article key={step.number}><span className="font-heading text-5xl font-bold text-orange-400">{step.number}</span><h3 className="mt-5 font-heading text-xl font-semibold">{step.title}</h3><p className="mt-3 leading-7 text-slate-300">{step.description}</p></article>)}</div></div>
    </section>
  );
}
