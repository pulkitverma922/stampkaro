const questions = [
  { question: "Do customers need to install an app?", answer: "No. They scan your QR and use StampKaro directly in their phone browser." },
  { question: "Can someone scan repeatedly to earn free rewards?", answer: "You control cooldowns, daily limits, and optional location checks. Sensitive stamp updates happen only on the server." },
  { question: "Can my staff confirm rewards?", answer: "Yes. Owner-created staff access allows your team to confirm short-lived redemption codes without changing business settings." },
  { question: "Does it work for more than one location?", answer: "Growth and Pro plans support multiple branches, shared loyalty rewards, and branch-level analytics." },
  { question: "Can I change my reward later?", answer: "Yes. Owners can update reward details and visit rules from their dashboard." },
];

export function Faq() {
  return <section className="bg-muted/30 px-5 py-20 sm:py-28"><div className="mx-auto max-w-3xl"><div className="text-center"><p className="font-semibold text-primary">Questions, answered</p><h2 className="mt-3 font-heading text-3xl font-bold">Frequently asked questions</h2></div><div className="mt-10 divide-y rounded-2xl border bg-background px-6">{questions.map((item) => <details key={item.question} className="group py-5"><summary className="cursor-pointer list-none font-semibold">{item.question}<span className="float-right text-primary group-open:rotate-45">+</span></summary><p className="mt-3 pr-8 leading-7 text-muted-foreground">{item.answer}</p></details>)}</div></div></section>;
}
