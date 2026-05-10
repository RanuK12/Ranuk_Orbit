// Ranuk Orbit — Service Worker (Network First for HTML, SWR for assets)
// Ensures users always see the latest deployed version.

var CACHE_NAME = 'ranuk-v1';
var ASSETS_TO_CACHE = ['/', '/es/', '/en/', '/it/'];

// Install: cache shell
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch handler
self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // HTML pages: Network First
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(function(response) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(function() {
          return caches.match(request);
        })
    );
    return;
  }

  // Assets: Stale While Revalidate
  if (['script', 'style', 'image', 'font', 'video'].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        var fetchPromise = fetch(request).then(function(networkResponse) {
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(function() {
          return cached;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Everything else: network with cache fallback
  event.respondWith(
    fetch(request).catch(function() {
      return caches.match(request);
    })
  );
});
