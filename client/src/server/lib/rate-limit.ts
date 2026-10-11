/**
 * Minimal in-memory sliding-window rate limiter.
 * Per serverless-instance only (Vercel lambdas don't share memory) — it won't
 * stop a fully distributed attack, but it cheaply stops scripted abuse and
 * accidental floods per instance. Swap for Upstash Redis if stricter limits
 * are ever needed.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    const err = new Error("Too many requests. Please try again shortly.") as Error & { status: number };
    err.status = 429;
    throw err;
  }
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
