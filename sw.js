// sw.js — song-display service worker
// APP_VERSION must be bumped with every release that changes cached files.
const APP_VERSION = '6.0';
const CACHE       = 'song-display-' + APP_VERSION;

const APP_SHELL = [
  './index.html',
  './style.css',
  './data.js',
  './db.js',
  './parser.js',
  './viewer.js',
  './fetcher.js',
  './editor.js',
  './setlist-manager.js',
  './voice.js',
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

// ── Install: pre-cache app shell ──────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(APP_SHELL))
      .then(() => self.skipWaiting())   // activate immediately
  );
});

// ── Activate: delete old caches, notify clients ───────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Tell all open tabs a new version is active
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(c => c.postMessage({ type: 'NEW_VERSION', version: APP_VERSION }));
        });
      })
  );
});

// ── Fetch: network-first for app shell, cache fallback ────
// Network-first means users always get fresh code when online.
// Cache serves as offline fallback only.
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Only handle same-origin GET requests
  if (e.request.method !== 'GET') return;
  if (!url.startsWith(self.location.origin) && !url.includes('fonts.googleapis.com') && !url.includes('fonts.gstatic.com')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache a fresh copy
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))  // offline fallback
  );
});
