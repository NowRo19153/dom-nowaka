const CACHE_NAME = 'dom-nowaka-v1';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// instalacja – zapisujemy pliki do cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// aktywacja – sprzątanie starych cache'y
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// fetch – najpierw sieć, jak padnie, to cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // awaryjnie index.html
          return caches.match('./index.html');
        });
      })
  );
});
