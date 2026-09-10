// Rate limiter em memória, por instância da edge function.
// Simples e best-effort (reinicia junto com a instância) — suficiente como
// primeira barreira anti-abuso, combinado com o honeypot e a validação.

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/** true = estourou o limite */
export function isRateLimited(key: string, max = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}
