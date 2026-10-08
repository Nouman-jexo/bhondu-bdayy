// 1. Safely import OneSignal without crashing when offline
try {
  importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
} catch (e) {
  console.log('OneSignal SDK offline mode');
}

const CACHE_NAME = 'bhondu-bdayy-v5';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icon.png'
];

// 2. Install Event - Pre-cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// 3. Activate Event - Clean up old caches & take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Helper: Synthesize HTTP 206 Range Responses for Offline Audio Playback
async function handleAudioRangeRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  let response = await cache.match(request, { ignoreSearch: true });

  if (!response) {
    const cleanRequest = new Request(request.url, { method: 'GET' });
    response = await cache.match(cleanRequest);
  }

  // If not cached, fetch from network and cache for future offline use
  if (!response) {
    try {
      const netResponse = await fetch(request);
      if (netResponse && (netResponse.status === 200 || netResponse.type === 'opaque')) {
        cache.put(request, netResponse.clone());
      }
      return netResponse;
    } catch (err) {
      return new Response('', { status: 416, statusText: 'Range Not Satisfiable' });
    }
  }

  const rangeHeader = request.headers.get('Range');
  if (!rangeHeader) return response;

  const buffer = await response.arrayBuffer();
  const parts = rangeHeader.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10) || 0;
  const end = parts[1] ? parseInt(parts[1], 10) : buffer.byteLength - 1;

  const slicedBuffer = buffer.slice(start, end + 1);
  return new Response(slicedBuffer, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${buffer.byteLength}`,
      'Content-Length': slicedBuffer.byteLength,
      'Accept-Ranges': 'bytes'
    }
  });
}

// 4. Fetch Event Handler
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Strategy A: Audio Files & Media Range Requests
  if (/\.(mp3|wav|ogg|m4a|aac)$/i.test(url.pathname) || event.request.headers.has('range')) {
    event.respondWith(handleAudioRangeRequest(event.request));
    return;
  }

  // Strategy B: Static Assets & Images
  const isAsset =
    url.pathname.startsWith('/_next/image') ||
    url.pathname.startsWith('/_next/static') ||
    /\.(png|jpg|jpeg|svg|webp|gif|ico|woff2?|css|js)$/i.test(url.pathname);

  if (isAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          return new Response('Asset unavailable offline', { status: 404 });
        }
      })
    );
    return;
  }

  // Strategy C: HTML Page Navigation
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        if (event.request.mode === 'navigate') {
          return cache.match('/');
        }
        throw error;
      }
    })
  );
});
