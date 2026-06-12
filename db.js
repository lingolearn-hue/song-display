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

  // ── Data versioning & migration ───────────────────────────
  // Bump DATA_VERSION whenever sample data changes or a migration is needed.
  const DATA_VERSION = 5;  // v0.6: added German Christmas songs

  async function migrate() {
    await open();
    const stored = await getSetting('dataVersion', 0);
    if (stored >= DATA_VERSION) return;

    // v1→v2: remove copyrighted sample songs from v0.1/v0.2
    if (stored < 2) {
      const copyrightedIds = ['1','2','3','4','5','6'];
      for (const id of copyrightedIds) {
        const s = await getSong(id);
        if (s) await deleteSong(id);
      }
      // Remove old demo setlists
      const oldSlIds = ['sl1','sl2','sl3'];
      for (const id of oldSlIds) {
        try {
          await wrap(tx('setlists', 'readwrite').delete(id));
        } catch(_) {}
      }
    }

    // v2→v3: reseed expanded songbook if only old 6 pd songs remain
    if (stored < 3) {
      const remaining = await getAllSongs();
      const oldPdIds = new Set(['pd-001','pd-002','pd-003','pd-004','pd-005','pd-006']);
      const isOnlyOldSeeds = remaining.length > 0 && remaining.every(s => oldPdIds.has(s.id));
      if (remaining.length === 0 || isOnlyOldSeeds) {
        for (const id of ['sl-demo-1','sl-demo-2']) {
          try { await wrap(tx('setlists','readwrite').delete(id)); } catch(_) {}
        }
        for (const song of SONGS)    await putSong({ ...song });
        for (const sl   of SETLISTS) await putSetlist({ ...sl });
      }
    }

    // v3→v4: add new German and Chinese songs to existing installs
    if (stored < 4) {
      const newIds = ['pd-031','pd-032','pd-033','pd-034','pd-035','pd-036','pd-037','pd-038',
                      'pd-039','pd-040','pd-041','pd-042','pd-043','pd-044','pd-045','pd-046'];
      for (const id of newIds) {
        const existing = await getSong(id);
        if (!existing) {
          const song = SONGS.find(s => s.id === id);
          if (song) await putSong({ ...song });
        }
      }
      // Add new setlists
      const newSlIds = ['sl-demo-5','sl-demo-6'];
      for (const id of newSlIds) {
        const sl = SETLISTS.find(s => s.id === id);
        if (sl) await putSetlist({ ...sl });
      }
    }

    // v4→v5: add German Christmas songs
    if (stored < 5) {
      const newIds = ['pd-047','pd-048','pd-049','pd-050','pd-051','pd-052',
                      'pd-053','pd-054','pd-055','pd-056','pd-057'];
      for (const id of newIds) {
        const existing = await getSong(id);
        if (!existing) {
          const song = SONGS.find(s => s.id === id);
          if (song) await putSong({ ...song });
        }
      }
      const xmasSl = SETLISTS.find(s => s.id === 'sl-demo-7');
      if (xmasSl) await putSetlist({ ...xmasSl });
    }

    await setSetting('dataVersion', DATA_VERSION);
  }

  // Keep seedIfEmpty as alias for backwards compat with any cached app.js
  async function seedIfEmpty() { return migrate(); }

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
    migrate, seedIfEmpty, exportSbook, importSbook,
  };
})();

// ── UUID helper ───────────────────────────────────────────
function uuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
