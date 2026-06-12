// sw.js — song-display service worker
const CACHE = 'song-display-v03';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './db.js',
  './parser.js',
  './viewer.js',
  './app.js',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // App shell: cache-first
  if (APP_SHELL.some(u => e.request.url.endsWith(u.replace('./', '')))) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
    return;
  }
  // Google Fonts and other external: network-first, fall back to cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
