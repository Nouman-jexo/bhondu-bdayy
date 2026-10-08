// 1. Safely import OneSignal without crashing when offline
try {
  importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
} catch (e) {
  console.log('OneSignal SDK offline mode');
}

const CACHE_NAME = 'bhondu-bdayy-v3';

// 2. Install Event - Force immediate activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 3. Activate Event - Clean up old cache versions & take control immediately
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

// 4. Fetch Event - Serve from network, cache on success, fallback to cache when offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  
  // Only cache requests from our own domain
  if (url.origin !== self.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // Serve cached version when offline
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Navigation fallback for main page
        if (event.request.mode === 'navigate') {
          return cache.match('/');
        }
        throw error;
      }
    })
  );
});
