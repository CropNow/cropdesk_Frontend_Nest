const CACHE_NAME = 'cropdesk-v4';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
];

// ── Install: pre-cache the app shell ────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ──────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ── Fetch: Network-first with dynamic runtime caching ────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests (POST, PUT, DELETE, etc.)
  if (request.method !== 'GET') return;

  // 2. Skip backend API calls — sensor/farm data must always be live
  //    (matches your actual API base: 4.186.31.224:8081 or any /api/ path)
  if (
    url.hostname === '4.186.31.224' ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // 3. Skip chrome-extension and non-http requests
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Only cache valid responses (status 200, basic type = same-origin)
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || networkResponse.type === 'cors')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed — try the cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // For HTML navigation requests (page reload while offline),
          // serve the app shell so React Router can handle routing
          if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
          }

          // Nothing available — return a generic offline response
          return new Response(
            JSON.stringify({ error: 'offline', message: 'No network connection.' }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        });
      })
  );
});
