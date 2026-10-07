const CACHE_NAME = 'bhondu-pwa-v5';

// Install: Cache the main page, but don't crash if it fails
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add('/').catch(() => console.log('Skipped root cache on install'));
    })
  );
});

// Activate: Clean up old caches instantly
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Bulletproof Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests (ignore APIs, extensions, etc.)
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      
      // 1. If we have the file in cache, return it instantly
      if (cachedResponse) {
        // Silently update the cache in the background if we have internet
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {}); // Ignore network errors in background
        
        return cachedResponse;
      }

      // 2. If not in cache, fetch from internet and save it for next time
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // 3. OFFLINE FALLBACK: If internet is off and user is trying to load a page, show the saved root page
          if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
            return caches.match('/', { ignoreSearch: true });
          }
        });
    })
  );
});
