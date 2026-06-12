// db.js — IndexedDB persistence layer

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

  // ── Songs ─────────────────────────────────────────────────
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

  // ── Setlists ──────────────────────────────────────────────
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

  // ── Settings ──────────────────────────────────────────────
  async function getSetting(key, fallback = null) {
    await open();
    const row = await wrap(tx('settings').get(key));
    return row ? row.value : fallback;
  }
  async function setSetting(key, value) {
    await open();
    return wrap(tx('settings', 'readwrite').put({ key, value }));
  }

  // ── Migration ─────────────────────────────────────────────
  // DATA_VERSION must be bumped whenever SONGS or SETLISTS change.
  // Strategy: always sync every demo song and setlist that should exist,
  // regardless of stored version. This makes migration idempotent and
  // safe to re-run — existing user-added songs are never touched.
  const DATA_VERSION = 6;  // v0.6: robust sync-based migration

  async function migrate() {
    await open();
    const stored = await getSetting('dataVersion', 0);
    if (stored >= DATA_VERSION) return;

    // Step 1: remove old copyrighted songs from v0.1/v0.2 (IDs '1'–'6')
    if (stored < 2) {
      for (const id of ['1','2','3','4','5','6']) {
        const s = await getSong(id);
        if (s) await deleteSong(id);
      }
      for (const id of ['sl1','sl2','sl3']) {
        try { await wrap(tx('setlists','readwrite').delete(id)); } catch(_) {}
      }
    }

    // Step 2: sync ALL demo songs — add any that are missing, never overwrite
    // user-edited songs (we check by ID only — if it exists, skip it)
    for (const song of SONGS) {
      const existing = await getSong(song.id);
      if (!existing) {
        await putSong({ ...song });
      }
    }

    // Step 3: sync ALL demo setlists — add any that are missing
    const existingSetlists = await getAllSetlists();
    const existingSlIds = new Set(existingSetlists.map(s => s.id));
    for (const sl of SETLISTS) {
      if (!existingSlIds.has(sl.id)) {
        await putSetlist({ ...sl });
      }
    }

    // Step 4: remove old demo setlists that no longer exist in SETLISTS
    // (only remove known old IDs, never touch user-created ones)
    const currentSlIds = new Set(SETLISTS.map(s => s.id));
    const oldDemoIds = ['sl-demo-1','sl-demo-2','sl-demo-3','sl-demo-4',
                        'sl-demo-5','sl-demo-6','sl-demo-7'];
    for (const id of oldDemoIds) {
      if (!currentSlIds.has(id) && existingSlIds.has(id)) {
        await deleteSetlist(id);
      }
    }

    await setSetting('dataVersion', DATA_VERSION);
  }

  // Alias for backwards compat
  async function seedIfEmpty() { return migrate(); }

  // ── Export / Import ───────────────────────────────────────
  async function exportSbook() {
    const songs    = await getAllSongs();
    const setlists = await getAllSetlists();
    return JSON.stringify({ version: 1, songs, setlists }, null, 2);
  }

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
    migrate, seedIfEmpty, exportSbook, importSbook,
  };
})();

// ── UUID helper ───────────────────────────────────────────
function uuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
