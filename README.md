# song-display v0.3

Static HTML/CSS/JS. No build step — open `index.html` in a browser.
For PWA install / service worker to work, serve over HTTP (e.g. `npx serve .`).

## What's new in v0.3

- **Song editing** — Edit button in song list and viewer opens a slide-in panel.
  Edit title, artist, key, capo, BPM. Edit text content, label, format, language.
  Add or delete additional texts per song. Delete the whole song.
- **Setlist editing** — Create, rename, delete setlists.
  Add songs via a search picker. Remove songs from a setlist.
  Drag-to-reorder songs within a setlist.
- **URL import** — Paste a URL from Ultimate Guitar, Chordie, or E-Chords.
  Fetched via configurable CORS proxy (default: allorigins.win).
  Parsed into ChordPro, feeds into the same preview/save flow.
  Proxy URL configurable in Settings.
- **Manual entry preview** — Manual tab now also shows preview before saving.
- **PWA** — manifest.json + service worker for offline use and home screen install.
  Register by serving over HTTP (file:// does not activate service workers).

## Files

```
index.html          — shell, all screens, editor panel markup
style.css           — all styles including v0.2 and v0.3 additions
data.js             — sample seed data
db.js               — IndexedDB layer
parser.js           — ChordPro parser, tab-style detector, format auto-detect
viewer.js           — full-screen viewer, DOM pagination, autoscroll
fetcher.js          — URL import, CORS proxy, per-site parsers (UG/Chordie/E-Chords)
editor.js           — song edit slide-in panel
setlist-manager.js  — setlist CRUD and drag-reorder
app.js              — navigation and wiring
manifest.json       — PWA manifest
sw.js               — service worker (cache-first app shell)
icon-192.png        — PWA icon (placeholder — replace with real artwork)
icon-512.png        — PWA icon (placeholder)
```

## Open questions carried forward

- UG import: proxy may still be blocked — browser extension fallback not yet implemented
- OCR import (Tesseract.js) — v0.4
- Voice scroll commands — v0.4
- Setlist queue / auto-advance to next song — v0.4
