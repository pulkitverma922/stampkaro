/** IST day key, e.g. 2026-10-08 — used for dailyStats doc IDs. */
export const dayKey = (d = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);

/** Hour bucket for idempotent scan IDs, e.g. 2026100810 */
export const hourKey = (d = new Date()) => dayKey(d).replaceAll("-", "") +
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hourCycle: "h23" }).format(d);
