// 1. MUST keep OneSignal imported for notifications to work!
try {
  importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
} catch (e) {
  console.log('OneSignal offline fallback');
}

const CACHE = 'aleena-v2';
const PRECACHE = [
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
  '/audio/bgm.mp3',
];

// 2. Install Event - Individual file caching (won't crash if 1 file fails)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return Promise.allSettled(
        PRECACHE.map((url) => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

// 3. Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Helper for HTTP Range Requests (Fixes MP3 playback offline)
async function handleAudioRange(request) {
  const cache = await caches.open(CACHE);
  const response = await cache.match(request, { ignoreSearch: true });

  if (!response) {
    try {
      const netResp = await fetch(request);
      if (netResp.ok) cache.put(request, netResp.clone());
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

// 4. Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Handle MP3 audio streaming offline
  if (url.pathname.endsWith('.mp3') || request.headers.has('range')) {
    event.respondWith(handleAudioRange(request));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Navigation requests (Pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Static Assets
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
