import { ApiError } from "@/lib/utils/api";

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function enforceRateLimit(key: string, options: { limit: number; windowMs: number }) {
  const now = Date.now();
  if (buckets.size > 10_000) for (const [bucketKey, value] of buckets) if (value.resetAt <= now) buckets.delete(bucketKey);
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + options.windowMs }); return; }
  if (entry.count >= options.limit) throw new ApiError("FORBIDDEN", "Too many requests. Please try again shortly.", 429, { retryAfterMs: entry.resetAt - now });
  entry.count += 1;
}
