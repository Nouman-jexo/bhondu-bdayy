// 1. OneSignal SDK Import (Required for Push Notifications)
try {
  importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
} catch (e) {
  console.log('OneSignal offline mode');
}

const CACHE_NAME = 'aleena-offline-v7';

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

// 2. Install Event - Pre-cache all core app assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

// 3. Activate Event - Clear old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Helper: HTTP 206 Range Streamer for Offline MP3 Audio
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
      return new Response('', { status: 416, statusText: 'Range Not Satisfiable' });
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

// 4. Fetch Event Handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Strategy A: Audio Streaming / Range Requests
  if (url.pathname.endsWith('.mp3') || request.headers.has('range')) {
    event.respondWith(handleAudioRange(request));
    return;
  }

  // Strategy B: Page Navigations & Next.js App Router (_rsc) Data Requests
  if (request.mode === 'navigate' || url.searchParams.has('_rsc')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const home = await caches.match('/');
          if (home) return home;
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // Strategy C: Static Assets (Cache-First with Network Fallback)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          if (request.destination === 'image') {
            return caches.match('/images/panda.png');
          }
        });
    })
  );
});
