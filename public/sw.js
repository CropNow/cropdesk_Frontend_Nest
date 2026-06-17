const CACHE_NAME = 'cropdesk-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/NEST.png',
  '/seed.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Do NOT cache API requests or non-GET requests or backend connection calls
  const isApiRequest = 
    url.pathname.includes('/api/v1/') || 
    url.hostname === 'apis.cropdesk.in' || 
    url.port === '8081' || 
    url.hostname.includes('open-meteo.com');

  if (event.request.method !== 'GET' || isApiRequest) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return a standard network error response to avoid uncaught promise rejections
        return Response.error();
      })
    );
    return;
  }



  // Support React Router offline navigation using index.html fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html').then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response('Offline - page not cached', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
    );
    return;
  }

  // Network-first with cache fallback for other GET requests (assets, bundles, styles, images, fonts)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache valid status 200 responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return a clean 404 response for cache misses when offline
          return new Response('Offline - resource not cached', {
            status: 404,
            statusText: 'Not Found',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});

