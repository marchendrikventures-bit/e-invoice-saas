// SECURITY: Simple in-memory rate limiter, shared across API routes.
// NOTE: this is per-instance only — it resets on cold start and does not
// coordinate across multiple server instances. Fine for a single-region
// deploy on modest traffic; swap for a shared store (Redis/Upstash) if the
// app scales beyond one instance.
const buckets = new Map<string, { count: number; resetTime: number }>();

export function isRateLimited(key: string, windowMs: number, maxAttempts: number): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now > entry.resetTime) {
    buckets.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > maxAttempts;
}

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
}
