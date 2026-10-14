export default function Loading() {
  return <main className="mx-auto max-w-7xl animate-pulse px-5 py-10"><div className="h-5 w-28 rounded bg-orange-100"/><div className="mt-3 h-10 w-72 rounded-xl bg-muted"/><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 rounded-2xl bg-muted" />)}</div><div className="mt-6 h-80 rounded-3xl bg-muted" /></main>;
}
