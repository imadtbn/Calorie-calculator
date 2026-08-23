const CACHE_NAME = 'calorie-calculator-v13';
const CORE_ASSETS = [
  './', './index.html', './css/main.css', './js/app.js', './js/calculators.js', './js/deferred-adsense.js', './js/comments.js',
  './health-tools.html', './bmi-calculator.html', './calorie-calculator.html', './water-calculator.html', './ideal-weight-calculator.html',
  './pregnancy-due-date.html', './fertile-window.html', './prediabetes-risk.html', './child-bmi-calculator.html', './pregnancy-calorie-calculator.html', './infant-growth-calculator.html',
  './asthma-control.html', './anxiety-screening.html', './eating-awareness.html', './sleep-assessment.html', './depression-screening.html', './visual-acuity-screening.html', './phone-balance.html', './pilgrim-health-checklist.html', './diabetes-awareness.html',
  './data/cdc-bmi-for-age.json', './data/who-infant-growth.json',
  './articles/asthma-control.html', './articles/anxiety-screening.html', './articles/eating-awareness.html', './articles/sleep-assessment.html', './articles/depression-screening.html', './articles/visual-acuity-screening.html', './articles/phone-balance.html', './articles/pilgrim-health-checklist.html', './articles/diabetes-awareness.html',
  './assets/tools/asthma-control.jpg', './assets/tools/anxiety-screening.jpg', './assets/tools/eating-awareness.jpg', './assets/tools/sleep-assessment.jpg', './assets/tools/depression-support.jpg', './assets/tools/visual-acuity.jpg', './assets/tools/phone-balance.jpg', './assets/tools/pilgrim-health.jpg', './assets/tools/diabetes-awareness.jpg', './assets/tools/infant-growth.jpg', './assets/tools/pregnancy-care.jpg', './assets/tools/fertility-calendar.jpg', './assets/tools/body-metrics.jpg', './assets/tools/health-tools-hero.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
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
