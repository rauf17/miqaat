/*
 * Miqaat Service Worker — hand-rolled for Next.js 16 + Turbopack
 * compatibility (avoids the @serwist/next webpack-plugin conflict).
 *
 * PSP-023: enables true offline PWA support. After first visit, the
 * app shell + static assets + selected API responses are cached, so
 * the app loads without a network.
 *
 * Cache strategy:
 *  - App shell (HTML navigations): NetworkFirst with cache fallback
 *    (so users get fresh content when online, cached when offline).
 *  - Static assets (_next/static/*, textures, icons): CacheFirst,
 *    immutable (filenames are content-hashed).
 *  - API routes (/api/weather, /api/geocode): StaleWhileRevalidate
 *    (serve cached immediately, refresh in background).
 *  - Reflection API (/api/reflection): NetworkOnly (LLM output should
 *    be fresh; cached client-side via the reflection cache module).
 */

const CACHE_VERSION = 'miqaat-v1';
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Assets to precache on install (the app shell).
const APP_SHELL_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icon',
  '/apple-icon',
  '/sun-texture.png',
  '/moon-texture.png',
];

// ─── Install: precache app shell ──────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        // Don't fail install if some assets 404; they'll be cached on demand.
        console.warn('[SW] precache partial failure:', err);
      })
  );
});

// ─── Activate: clean old caches ───────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Fetch: routing strategy ──────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET; let the browser handle everything else.
  if (request.method !== 'GET') return;

  // Don't intercept cross-origin requests (e.g. Open-Meteo, Google).
  if (url.origin !== self.location.origin) return;

  // Navigation requests (HTML pages) → NetworkFirst
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets → CacheFirst (immutable)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname === '/icon' ||
    url.pathname === '/apple-icon' ||
    url.pathname === '/opengraph-image'
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // API routes → StaleWhileRevalidate (except /api/reflection which is NetworkOnly)
  if (url.pathname.startsWith('/api/')) {
    if (url.pathname === '/api/reflection') {
      // NetworkOnly — LLM output should be fresh
      return;
    }
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Everything else → StaleWhileRevalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ─── Cache strategies ─────────────────────────────────────────────
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    // Offline — try cache, then fallback to cached navigation
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    // Final fallback for navigations: the cached app shell
    if (request.mode === 'navigate') {
      const shell = await caches.match('/');
      if (shell) return shell;
    }
    throw err;
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    // Offline and not cached — return a placeholder for images
    if (request.destination === 'image') {
      return new Response('', { status: 204 });
    }
    throw err;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse); // offline → return cache
  return cachedResponse || fetchPromise;
}

// ─── Message: allow page to trigger skipWaiting ────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
