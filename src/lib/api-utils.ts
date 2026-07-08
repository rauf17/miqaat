import { NextResponse } from 'next/server';

/**
 * Shared API utilities for input validation, rate limiting, cache headers,
 * and safe upstream fetching. Addresses audit Theme 4 (API hardening):
 * WTH-001, WTH-002, WTH-010, WTH-016, WTH-027, WTH-028, P-H-016, P-H-041,
 * P-H-043, PSP-003, PSP-031.
 */

/**
 * Validate and parse lat/lng query params. Returns null + a 400
 * NextResponse on invalid input.
 */
export function parseCoords(searchParams: URLSearchParams): { lat: number; lng: number } | NextResponse {
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  if (latStr === null || lngStr === null) {
    return NextResponse.json({ error: 'Missing lat or lng parameter' }, { status: 400 });
  }
  const lat = Number(latStr);
  const lng = Number(lngStr);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: 'lat and lng must be finite numbers' }, { status: 400 });
  }
  if (lat < -90 || lat > 90) {
    return NextResponse.json({ error: `Latitude out of range [-90, 90]: ${lat}` }, { status: 400 });
  }
  if (lng < -180 || lng > 180) {
    return NextResponse.json({ error: `Longitude out of range [-180, 180]: ${lng}` }, { status: 400 });
  }
  return { lat, lng };
}

/**
 * In-memory per-IP token-bucket rate limiter.
 *
 * NOTE: This is per-server-instance. On Vercel serverless, each
 * function invocation may be a fresh instance, so this is a best-effort
 * limiter, not a hard guarantee. For production-grade limiting, use
 * Upstash Redis or Vercel KV. But this catches the most egregious abuse
 * (tight loops, buggy clients) and respects Nominatim's ≤1 req/s policy
 * within a single instance.
 */
const buckets = new Map<string, { tokens: number; refillAt: number }>();

export function rateLimit(
  ip: string,
  capacity: number,
  refillPerSec: number,
): boolean {
  const now = Date.now();
  const entry = buckets.get(ip);
  if (!entry) {
    buckets.set(ip, { tokens: capacity - 1, refillAt: now + 1000 / refillPerSec });
    return true;
  }
  // Refill
  const elapsed = now - (entry.refillAt - 1000 / refillPerSec);
  const refilled = Math.min(capacity, entry.tokens + (elapsed / 1000) * refillPerSec);
  if (refilled < 1) {
    return false; // rate limited
  }
  buckets.set(ip, { tokens: refilled - 1, refillAt: now + 1000 / refillPerSec });
  return true;
}

/**
 * Extract client IP from request headers (Vercel forwards via
 * x-forwarded-for). Falls back to 'unknown'.
 */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return 'unknown';
}

/**
 * Safe upstream fetch with timeout. Throws on network error or non-2xx.
 * Use with try/catch in the route handler.
 */
export async function safeFetch(url: string, opts: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Upstream ${res.status}: ${res.statusText}`);
    }
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Build a NextResponse with cache headers. `sMaxAge` controls the CDN
 * cache (Vercel edge); `staleWhileRevalidate` controls how long stale
 * content is served while refreshing in the background.
 */
export function withCache(
  body: unknown,
  status: number = 200,
  sMaxAge: number = 1800,
  staleWhileRevalidate: number = 3600,
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    },
  });
}

/**
 * Safely parse a JSON request body. Returns null on malformed JSON
 * (audit P-H-043: previously returned 500, now returns 400 upstream).
 */
export async function safeParseJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
