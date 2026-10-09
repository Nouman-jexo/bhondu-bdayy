// 1. OneSignal SDK Import (Required for Push Notifications)
try {
  importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
} catch (e) {
  console.log('OneSignal offline mode');
}

const CACHE_NAME = 'aleena-pwa-v8';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/images/panda.png',
  '/images/vintage-paper.png',
  '/images/gf-1.jpeg',
  '/images/gf-2.jpeg',
  '/images/gf-3.jpeg',
  '/images/gf-4.jpeg',
  '/images/gf-5.jpeg',
  '/images/user-1.jpeg',
  '/images/user-2.jpeg',
  '/images/user-3.jpeg',
  '/images/user-4.jpeg',
  '/images/user-5.jpeg',
  '/audio/bgm.mp3'
];

// 2. Install Event - Force immediate takeover
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) => cache.add(url))
      );
    })
  );
});

// 3. Activate Event - Claim all open browser tabs immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Helper: HTTP 206 Range Request streamer for offline music
async function handleAudioRange(request) {
  const cache = await caches.open(CACHE_NAME);
  let response = await cache.match(request, { ignoreSearch: true });

  if (!response) {
    try {
      const netResp = await fetch(request);
      if (netResp && (netResp.ok || netResp.type === 'opaque')) {
        cache.put(request, netResp.clone());
      }
      return netResp;
    } catch (e) {
      return new Response('', { status: 416 });
    }
  }

  const rangeHeader = request.headers.get('Range');
  if (!rangeHeader) return response;

  const buffer = await response.arrayBuffer();
  const parts = rangeHeader.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10) || 0;
  const end = parts[1] ? parseInt(parts[1], 10) : buffer.byteLength - 1;

  return new Response(buffer.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${buffer.byteLength}`,
      'Content-Length': end - start + 1,
      'Accept-Ranges': 'bytes',
    },
  });
}

// 4. Fetch Event Handler - Cache-First with Network Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Strategy A: Stream MP3 Background Music
  if (url.pathname.endsWith('.mp3') || request.headers.has('range')) {
    event.respondWith(handleAudioRange(request));
    return;
  }

  // Strategy B: Handle Page Navigation & Static Assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache instantly, fetch update in background
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        }).catch(async () => {
          // Fallback to cached home page when offline
          if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
            const cachedHome = await caches.match('/');
            if (cachedHome) return cachedHome;
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
    );
  }
});
