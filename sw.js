// Ranuk Orbit — Service Worker (Network First)
// Estrategia: network-first para HTML, stale-while-revalidate para assets

var CACHE_NAME = 'ranuk-v1';
var ASSETS_TO_CACHE = [
  '/',
  '/es/',
  '/en/',
  '/it/'
];

// Instalar: cachear shell basico
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activar: limpiar caches viejas
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

// Fetch: Network First para HTML, Cache First para assets
self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);

  // Solo manejar requests GET del mismo origen
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // HTML pages: Network First (siempre traer version mas nueva)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(function(response) {
          // Actualizar cache con la version nueva
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(function() {
          // Si network falla, usar cache como fallback
          return caches.match(request);
        })
    );
    return;
  }

  // Assets (JS, CSS, images, fonts): Stale While Revalidate
  if (['script', 'style', 'image', 'font', 'video'].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        // Devolver cache inmediatamente (rapido)
        var fetchPromise = fetch(request).then(function(networkResponse) {
          // Actualizar cache en background
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(function() {
          return cached; // fallback a cache si network falla
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Todo lo demas: intentar network, fallback a cache
  event.respondWith(
    fetch(request).catch(function() {
      return caches.match(request);
    })
  );
});
