# song-display v0.5

Static HTML/CSS/JS. Open `index.html` in a browser, or serve with `npx serve .` for PWA/SW.

## What's new in v0.5

- **Voice page turner** — tap 🎤 Voice in the control drawer to start. Speech recognition
  listens continuously and advances pages when recognised words match upcoming lyrics.
  Intentionally low confidence threshold — works lazily, following rather than leading.
  Auto-detects song language (EN/DE/FR/ES/IT/NL/ZH) and sets recognition locale.
  Works on Chrome desktop, Chrome Android, and Safari iOS (iOS requires a user gesture).
- **Setlist queue** — opening a song from a setlist now loads the full setlist as a queue.
  A "Next up" bar slides up from the bottom on the last page. Tap ▶ Play to advance,
  or ✕ to dismiss.
- **Per-song font & transpose memory** — font size and transpose are remembered per song,
  restored automatically on next open. Stored in IndexedDB.
- **BPM tap tempo** — tap the Tap button in the control drawer to measure BPM.
  Tap ↑ Use to set scroll speed from the measured BPM (speed = BPM × 0.5).
- **Key auto-detect on import** — when saving a pasted/fetched song, the key is
  automatically set from the first chord in the ChordPro content.

## Files

```
index.html          — shell, all screens
style.css           — all styles
data.js             — 46 public domain songs, 6 setlists
db.js               — IndexedDB layer with versioned migration
parser.js           — ChordPro parser, ruby token model
viewer.js           — full-screen viewer, pagination, autoscroll, voice, queue
voice.js            — Web Speech API page turner with fuzzy lyric matching
fetcher.js          — URL import, CORS proxy, site parsers
editor.js           — song edit panel
setlist-manager.js  — setlist CRUD and drag-reorder
ocr.js              — Tesseract.js OCR with correction UI
app.js              — navigation and wiring
manifest.json / sw.js — PWA
```
