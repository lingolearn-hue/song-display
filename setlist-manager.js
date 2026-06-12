// setlist-manager.js — create, rename, delete setlists; add/remove/reorder songs

const SetlistManager = (() => {

  let setlists   = [];
  let allSongs   = [];
  let activeId   = null;
  let dragSrc    = null;   // index of dragged card
  let onChange   = null;   // callback when data changes

  const $ = id => document.getElementById(id);

  // ── Load ──────────────────────────────────────────────────
  async function load(songList) {
    allSongs  = songList;
    setlists  = await DB.getAllSetlists();
    renderSidebar();
    if (activeId) {
      const sl = setlists.find(s => s.id === activeId);
      if (sl) renderMain(sl); else renderMain(null);
    }
  }

  // ── Sidebar ───────────────────────────────────────────────
  function renderSidebar() {
    const el = $('setlist-list');
    el.innerHTML = '';
    setlists.forEach(sl => {
      const item = document.createElement('div');
      item.className = 'setlist-item' + (sl.id === activeId ? ' active' : '');
      item.innerHTML = `
        <span class="sl-name">${esc(sl.name)}</span>
        <span class="setlist-count">${sl.songIds.length}</span>
      `;
      item.addEventListener('click', () => {
        activeId = sl.id;
        renderSidebar();
        renderMain(sl);
      });
      el.appendChild(item);
    });
  }

  // ── Main panel ────────────────────────────────────────────
  function renderMain(sl) {
    const mainEl = $('setlist-main');
    if (!sl) {
      mainEl.innerHTML = '<div class="setlist-empty">Select a setlist</div>';
      return;
    }

    const songs = sl.songIds.map(id => allSongs.find(s => s.id === id)).filter(Boolean);

    mainEl.innerHTML = `
      <div class="setlist-toolbar">
        <h3 id="sl-title-display">${esc(sl.name)}</h3>
        <button class="btn-sm" id="sl-rename">Rename</button>
        <button class="btn-sm" id="sl-add-song">+ Song</button>
        <button class="btn-sm danger" id="sl-delete">Delete</button>
        ${songs.length ? `<button class="btn-sm primary" id="sl-play">▶ Play All</button>` : ''}
      </div>
      <div class="setlist-songs" id="active-sl-songs"></div>

      <!-- Add song picker (hidden by default) -->
      <div id="sl-song-picker" class="sl-song-picker hidden">
        <div class="picker-header">
          <input type="text" id="picker-search" placeholder="Search songs…" autocomplete="off">
          <button class="btn-sm" id="picker-close">✕</button>
        </div>
        <div id="picker-list" class="picker-list"></div>
      </div>
    `;

    const songsEl = $('active-sl-songs');
    songs.forEach((song, i) => {
      const card = makeCard(song, i, sl);
      songsEl.appendChild(card);
    });

    // Toolbar actions
    $('sl-rename').addEventListener('click', () => renameSetlist(sl));
    $('sl-delete').addEventListener('click', () => deleteSetlist(sl));
    $('sl-add-song').addEventListener('click', () => openSongPicker(sl));
    if ($('sl-play')) {
      $('sl-play').addEventListener('click', () => {
        if (onChange) onChange('play', sl, songs[0]);
      });
    }

    // Picker search
    $('picker-search').addEventListener('input', () =>
      renderPickerList(sl, $('picker-search').value)
    );
    $('picker-close').addEventListener('click', () =>
      $('sl-song-picker').classList.add('hidden')
    );
  }

  function makeCard(song, index, sl) {
    const card = document.createElement('div');
    card.className = 'setlist-card';
    card.draggable = true;
    card.dataset.index = index;
    card.innerHTML = `
      <span class="drag-handle" title="Drag to reorder">⠿</span>
      <span class="card-num">${String(index + 1).padStart(2, '0')}</span>
      <div class="card-info">
        <div class="card-title">${esc(song.title)}</div>
        <div class="card-artist">${esc(song.artist || '')}</div>
      </div>
      <span class="card-key">${esc(song.key || '')}</span>
      <span class="card-capo">${song.capo ? 'Capo ' + song.capo : '—'}</span>
      <button class="card-remove btn-icon" title="Remove from setlist">✕</button>
    `;

    // Open song on info area click
    card.querySelector('.card-info').addEventListener('click', () => {
      if (onChange) onChange('open', sl, song);
    });

    // Remove from setlist
    card.querySelector('.card-remove').addEventListener('click', async e => {
      e.stopPropagation();
      sl.songIds.splice(index, 1);
      await DB.putSetlist(sl);
      await load(allSongs);
    });

    // Drag-to-reorder
    card.addEventListener('dragstart', e => {
      dragSrc = index;
      e.dataTransfer.effectAllowed = 'move';
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.setlist-card').forEach(c => c.classList.remove('drag-over'));
    });
    card.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      document.querySelectorAll('.setlist-card').forEach(c => c.classList.remove('drag-over'));
      card.classList.add('drag-over');
    });
    card.addEventListener('drop', async e => {
      e.preventDefault();
      const target = parseInt(card.dataset.index);
      if (dragSrc === null || dragSrc === target) return;
      // Reorder
      const ids = [...sl.songIds];
      const [moved] = ids.splice(dragSrc, 1);
      ids.splice(target, 0, moved);
      sl.songIds = ids;
      await DB.putSetlist(sl);
      dragSrc = null;
      await load(allSongs);
    });

    return card;
  }

  // ── Song picker ───────────────────────────────────────────
  function openSongPicker(sl) {
    $('sl-song-picker').classList.remove('hidden');
    $('picker-search').value = '';
    $('picker-search').focus();
    renderPickerList(sl, '');
  }

  function renderPickerList(sl, filter) {
    const q    = filter.toLowerCase();
    const inSl = new Set(sl.songIds);
    const list = allSongs.filter(s =>
      (!q || s.title.toLowerCase().includes(q) || (s.artist||'').toLowerCase().includes(q))
    );
    const el = $('picker-list');
    el.innerHTML = '';
    list.forEach(song => {
      const item = document.createElement('div');
      const already = inSl.has(song.id);
      item.className = 'picker-item' + (already ? ' in-list' : '');
      item.innerHTML = `
        <div class="picker-item-info">
          <div class="picker-title">${esc(song.title)}</div>
          <div class="picker-artist">${esc(song.artist || '')}</div>
        </div>
        <span class="picker-action">${already ? '✓ Added' : '+ Add'}</span>
      `;
      if (!already) {
        item.addEventListener('click', async () => {
          sl.songIds.push(song.id);
          await DB.putSetlist(sl);
          await load(allSongs);
          // Re-open picker with same filter
          openSongPicker(sl);
        });
      }
      el.appendChild(item);
    });
    if (!list.length) {
      el.innerHTML = '<div class="picker-empty">No songs found</div>';
    }
  }

  // ── Rename ────────────────────────────────────────────────
  async function renameSetlist(sl) {
    const name = prompt('Rename setlist:', sl.name);
    if (!name || !name.trim()) return;
    sl.name = name.trim();
    await DB.putSetlist(sl);
    await load(allSongs);
  }

  // ── Delete ────────────────────────────────────────────────
  async function deleteSetlist(sl) {
    if (!confirm(`Delete "${sl.name}"?`)) return;
    await DB.deleteSetlist(sl.id);
    activeId = null;
    await load(allSongs);
    $('setlist-main').innerHTML = '<div class="setlist-empty">Select a setlist</div>';
  }

  // ── Create new ────────────────────────────────────────────
  async function createNew() {
    const name = prompt('Setlist name:');
    if (!name || !name.trim()) return;
    const sl = { id: uuid(), name: name.trim(), songIds: [] };
    await DB.putSetlist(sl);
    activeId = sl.id;
    await load(allSongs);
    const created = setlists.find(s => s.id === sl.id);
    if (created) renderMain(created);
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return {
    load,
    createNew,
    setOnChange(fn) { onChange = fn; },
  };
})();
