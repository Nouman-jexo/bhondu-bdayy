importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
const CACHE_NAME = 'bhondu-pwa-v10';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/audio/bgm.mp3'
];

// Install: Cache core assets individually
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        PRECACHE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => console.warn(`Failed to cache ${asset}:`, err))
        )
      );
    })
  );
});

// Activate: Remove older cache versions immediately
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

  // 1. AUDIO & MEDIA RANGE REQUEST HANDLER
  if (request.url.includes('/audio/') || request.url.endsWith('.mp3')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        let cachedResponse = await cache.match(request, { ignoreSearch: true });
        if (!cachedResponse) {
          cachedResponse = await cache.match('/audio/bgm.mp3', { ignoreSearch: true });
        }

        if (!cachedResponse) {
          return fetch(request);
        }

        const range = request.headers.get('range');
        if (!range) {
          return cachedResponse;
        }

        const blob = await cachedResponse.blob();
        const parts = range.replace(/bytes=/, '').split('-');
        let start = parseInt(parts[0], 10);
        let end = parts[1] ? parseInt(parts[1], 10) : blob.size - 1;

        if (isNaN(start)) start = 0;
        if (isNaN(end) || end >= blob.size) end = blob.size - 1;

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

  // 2. PAGES, STYLES, JS, NEXT.JS IMAGES & TEXTURES
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          // Save valid responses AND opaque cross-origin responses (status === 0 / type === 'opaque')
          if (
            networkResponse &&
            (networkResponse.status === 200 || networkResponse.type === 'opaque')
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
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
