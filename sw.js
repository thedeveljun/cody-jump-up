/* 통합 이전 기간용: 항상 최신을 먼저 받고(네트워크 우선), 끊겼을 때만 캐시 사용 */
const CACHE_NAME = 'cody-jump-up-v2';
const ASSETS = ['/cody-jump-up/', '/cody-jump-up/index.html', '/cody-jump-up/manifest.json', '/cody-jump-up/icon-192.png', '/cody-jump-up/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      if (res.ok && new URL(e.request.url).origin === location.origin) caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
