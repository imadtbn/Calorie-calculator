const CACHE_NAME = 'calorie-calculator-v8';
const CORE_ASSETS = ['./', './index.html', './css/main.css', './js/app.js', './js/deferred-adsense.js', './js/comments.js', './health-tools.html', './pregnancy-due-date.html', './fertile-window.html', './prediabetes-risk.html', './child-bmi-calculator.html', './pregnancy-calorie-calculator.html', './infant-growth-calculator.html', './data/cdc-bmi-for-age.json', './data/who-infant-growth.json'];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
