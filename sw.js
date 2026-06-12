// sw.js — song-display service worker v6.1
// APP_VERSION must be bumped with every release.
const APP_VERSION = '7.0';
const CACHE       = 'song-display-' + APP_VERSION;

// Files to pre-cache. data.js is intentionally excluded —
// it must always be fetched fresh so migrations see the latest SONGS array.
const APP_SHELL = [
  './index.html',
  './style.css',
  './db.js',
  './parser.js',
  './viewer.js',
  './voice.js',
  './fetcher.js',
  './editor.js',
  './setlist-manager.js',
  './ocr.js',
  './app.js',
  './manifest.json',
  './icon-32.png',
  './icon-120.png',
  './icon-152.png',
  './icon-167.png',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
];

// ── Install ───────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: purge old caches, notify clients ────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        self.clients.matchAll({ type: 'window' }).then(clients =>
          clients.forEach(c => c.postMessage({ type: 'NEW_VERSION', version: APP_VERSION }))
        );
      })
  );
});

// ── Fetch strategy ────────────────────────────────────────
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;

  // data.js: always network, no cache — ensures migrations see latest SONGS
  if (url.includes('data.js')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // App shell: network-first, cache fallback (offline support)
  const isShell = APP_SHELL.some(f => url.endsWith(f.replace('./', '')));
  const isFont  = url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com');

  if (isShell || isFont) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Everything else (CORS proxy, CDN): network only
  e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
});
