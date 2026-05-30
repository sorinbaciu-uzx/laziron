/**
 * Simple in-memory rate limiter for API endpoints.
 *
 * Limits are per-process: on Vercel serverless this means per warm instance.
 * Not perfect (resets on cold start, doesn't share across regions), but enough
 * to stop casual bots and credential stuffing from a single IP. For stricter
 * needs, swap to Upstash Redis or similar.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

function sweepIfNeeded(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (b.resetAt < now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
};

export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  sweepIfNeeded(now);
  const entry = buckets.get(key);
  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }
  if (entry.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  entry.count += 1;
  return { allowed: true, remaining: max - entry.count };
}

/** Extract client IP from common proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/** Reset the bucket for a key (e.g. on successful auth). */
export function rateLimitReset(key: string): void {
  buckets.delete(key);
}
