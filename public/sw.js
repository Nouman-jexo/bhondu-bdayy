const CACHE_NAME = 'bhondu-pwa-v8';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/audio/bgm.mp3'
];

// Install: Save core assets + audio file into storage
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

// Activate: Delete old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  // AUDIO & MEDIA RANGE REQUEST HANDLER
  if (request.url.includes('/audio/') || request.url.endsWith('.mp3')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match('/audio/bgm.mp3');
        if (!cachedResponse) {
          return fetch(request);
        }

        const range = request.headers.get('range');
        if (!range) {
          return cachedResponse;
        }

        // Slice cached blob into 206 Partial Content required by mobile HTML5 audio
        const blob = await cachedResponse.blob();
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : blob.size - 1;
        const chunk = blob.slice(start, end + 1);

        return new Response(chunk, {
          status: 206,
          statusText: 'Partial Content',
          headers: new Headers({
            'Content-Type': 'audio/mpeg',
            'Content-Range': `bytes ${start}-${end}/${blob.size}`,
            'Content-Length': chunk.size,
            'Accept-Ranges': 'bytes',
          }),
        });
      })
    );
    return;
  }

  // STANDARD PAGES & ASSETS
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
          return networkResponse;
        })
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('/', { ignoreSearch: true });
          }
        });
    })
  );
});
