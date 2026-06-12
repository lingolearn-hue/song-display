// db.js — IndexedDB persistence via native IDBDatabase (no lib dependency)

const DB = (() => {
  const DB_NAME    = 'song-display';
  const DB_VERSION = 1;
  let db = null;

  function open() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains('songs')) {
          const songs = d.createObjectStore('songs', { keyPath: 'id' });
          songs.createIndex('title',  'title',  { unique: false });
          songs.createIndex('artist', 'artist', { unique: false });
        }
        if (!d.objectStoreNames.contains('setlists')) {
          d.createObjectStore('setlists', { keyPath: 'id' });
        }
        if (!d.objectStoreNames.contains('settings')) {
          d.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      req.onsuccess  = (e) => { db = e.target.result; resolve(db); };
      req.onerror    = (e) => reject(e.target.error);
    });
  }

  function tx(store, mode = 'readonly') {
    return db.transaction(store, mode).objectStore(store);
  }

  function wrap(req) {
    return new Promise((res, rej) => {
      req.onsuccess = (e) => res(e.target.result);
      req.onerror   = (e) => rej(e.target.error);
    });
  }

  // ── Songs ────────────────────────────────────────────────
  async function getAllSongs() {
    await open();
    return wrap(tx('songs').getAll());
  }

  async function getSong(id) {
    await open();
    return wrap(tx('songs').get(id));
  }

  async function putSong(song) {
    await open();
    song.updatedAt = Date.now();
    if (!song.createdAt) song.createdAt = Date.now();
    return wrap(tx('songs', 'readwrite').put(song));
  }

  async function deleteSong(id) {
    await open();
    return wrap(tx('songs', 'readwrite').delete(id));
  }

  // ── Setlists ─────────────────────────────────────────────
  async function getAllSetlists() {
    await open();
    return wrap(tx('setlists').getAll());
  }

  async function putSetlist(sl) {
    await open();
    return wrap(tx('setlists', 'readwrite').put(sl));
  }

  async function deleteSetlist(id) {
    await open();
    return wrap(tx('setlists', 'readwrite').delete(id));
  }

  // ── Settings ─────────────────────────────────────────────
  async function getSetting(key, fallback = null) {
    await open();
    const row = await wrap(tx('settings').get(key));
    return row ? row.value : fallback;
  }

  async function setSetting(key, value) {
    await open();
    return wrap(tx('settings', 'readwrite').put({ key, value }));
  }

  // ── Seed with sample data if empty ───────────────────────
  async function seedIfEmpty() {
    await open();
    const existing = await getAllSongs();
    if (existing.length > 0) return false;
    for (const song of SONGS)    await putSong({ ...song });
    for (const sl   of SETLISTS) await putSetlist({ ...sl });
    return true;
  }

  // ── Export all as .sbook JSON ─────────────────────────────
  async function exportSbook() {
    const songs    = await getAllSongs();
    const setlists = await getAllSetlists();
    return JSON.stringify({ version: 1, songs, setlists }, null, 2);
  }

  // ── Import .sbook (merge, no overwrite by default) ────────
  async function importSbook(json, overwrite = false) {
    const data = JSON.parse(json);
    const existing = await getAllSongs();
    const existingIds = new Set(existing.map(s => s.id));
    let imported = 0, skipped = 0;
    for (const song of (data.songs || [])) {
      if (existingIds.has(song.id) && !overwrite) { skipped++; continue; }
      await putSong(song);
      imported++;
    }
    for (const sl of (data.setlists || [])) await putSetlist(sl);
    return { imported, skipped };
  }

  return {
    open, getAllSongs, getSong, putSong, deleteSong,
    getAllSetlists, putSetlist, deleteSetlist,
    getSetting, setSetting,
    seedIfEmpty, exportSbook, importSbook,
  };
})();

// ── UUID helper ───────────────────────────────────────────
function uuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
