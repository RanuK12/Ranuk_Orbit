// Ranuk Orbit — Service Worker v1
// Strategy: Cache-First for static assets, Network-First for HTML
const CACHE_NAME = 'ranuk-v2';
const STATIC_ASSETS = [
  '/vendor/react.18.2.0.min.js',
  '/vendor/react-dom.18.2.0.min.js',
  '/fonts/italiana-latin.woff2',
  '/fonts/marcellus-latin.woff2',
  '/fonts/dm-sans-latin.woff2',
  '/fonts/cormorant-garamond-latin.woff2',
  '/fonts/cormorant-garamond-italic-latin.woff2',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== location.origin) return;

  // HTML: Network-first (always get fresh)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // version.json: Always network (never cache)
  if (url.pathname === '/version.json') {
    e.respondWith(fetch(request));
    return;
  }

  // Static assets with ?v= hash: Cache-first (immutable)
  if (url.search.includes('v=') || url.pathname.startsWith('/vendor/') || url.pathname.startsWith('/fonts/')) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Media files: Cache-first with network fallback
  if (url.pathname.startsWith('/media/')) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok && response.headers.get('content-length') < 5000000) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => new Response('', { status: 404 }));
      })
    );
    return;
  }

  // Everything else: Stale-while-revalidate
  e.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
