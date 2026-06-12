// app.js v0.3

document.addEventListener('DOMContentLoaded', async () => {

  // ── Boot ──────────────────────────────────────────────────
  await DB.open();
  await DB.seedIfEmpty();
  Viewer.init();
  Editor.init();

  // ── Screen navigation ─────────────────────────────────────
  const navTabs = document.querySelectorAll('.nav-tab');

  function showScreen(name) {
    ['songs','setlists','import','settings','viewer'].forEach(s => {
      const el = document.getElementById('screen-' + s);
      if (el) el.classList.remove('active');
    });
    navTabs.forEach(t => t.classList.remove('active'));

    if (name === 'viewer') {
      document.body.classList.add('viewing');
    } else {
      document.body.classList.remove('viewing');
      navTabs.forEach(t => { if (t.dataset.screen === name) t.classList.add('active'); });
    }
    const target = document.getElementById('screen-' + name);
    if (target) target.classList.add('active');

    // Reload setlists when switching to that screen
    if (name === 'setlists') SetlistManager.load(allSongs);
  }

  navTabs.forEach(tab => tab.addEventListener('click', () => showScreen(tab.dataset.screen)));
  document.querySelector('.nav-cta').addEventListener('click', () => showScreen('import'));
  document.getElementById('viewer-back').addEventListener('click', () => showScreen('songs'));
  document.getElementById('viewer-edit').addEventListener('click', () => {
    if (currentViewerSong) openEditor(currentViewerSong);
  });

  // ── Song list ─────────────────────────────────────────────
  const songListEl = document.getElementById('song-list');
  const searchEl   = document.getElementById('song-search');
  let   allSongs   = [];
  let   currentViewerSong = null;

  async function loadSongs() {
    allSongs = await DB.getAllSongs();
    allSongs.sort((a, b) => a.title.localeCompare(b.title));
    renderSongList(searchEl.value);
  }

  function renderSongList(filter = '') {
    const q = filter.toLowerCase();
    const list = allSongs.filter(s =>
      s.title.toLowerCase().includes(q) || (s.artist || '').toLowerCase().includes(q)
    );
    songListEl.innerHTML = '';
    if (!list.length) {
      songListEl.innerHTML = '<div class="list-empty">No songs found</div>';
      return;
    }
    list.forEach(song => {
      const item = document.createElement('div');
      item.className = 'song-item';
      item.innerHTML = `
        <div class="song-item-info">
          <div class="song-item-title">${esc(song.title)}</div>
          <div class="song-item-artist">${esc(song.artist || '')}</div>
        </div>
        <div class="song-item-actions">
          <span class="song-item-key">${esc(song.key || '')}</span>
          <button class="btn-icon song-edit-btn" title="Edit song">✎</button>
        </div>
      `;
      item.querySelector('.song-item-info').addEventListener('click', () => openSong(song));
      item.querySelector('.song-edit-btn').addEventListener('click', e => {
        e.stopPropagation();
        openEditor(song);
      });
      songListEl.appendChild(item);
    });
  }

  searchEl.addEventListener('input', () => renderSongList(searchEl.value));
  await loadSongs();

  function openSong(song) {
    currentViewerSong = song;
    showScreen('viewer');
    Viewer.open(song);
  }

  function openEditor(song) {
    Editor.open(song, async (saved) => {
      await loadSongs();
      await SetlistManager.load(allSongs);
      if (saved && currentViewerSong && currentViewerSong.id === saved.id) {
        // Refresh viewer with updated song
        currentViewerSong = saved;
        Viewer.open(saved);
      }
      if (!saved) {
        // Song was deleted — go back to list if we were viewing it
        showScreen('songs');
      }
    });
  }

  // ── Setlists ──────────────────────────────────────────────
  SetlistManager.setOnChange((action, sl, song) => {
    if (action === 'open' && song) openSong(song);
    if (action === 'play' && song) openSong(song);
  });

  document.getElementById('new-setlist-btn').addEventListener('click', () => {
    SetlistManager.createNew();
  });

  // ── Import — method switcher ──────────────────────────────
  document.querySelectorAll('.import-method').forEach(method => {
    method.addEventListener('click', () => {
      document.querySelectorAll('.import-method').forEach(m => m.classList.remove('active'));
      document.querySelectorAll('.import-pane').forEach(p => p.classList.remove('active-pane'));
      method.classList.add('active');
      const pane = document.getElementById('import-' + method.dataset.method);
      if (pane) pane.classList.add('active-pane');
    });
  });

  // ── Paste import ──────────────────────────────────────────
  document.getElementById('paste-detect').addEventListener('click', () => {
    const raw = document.getElementById('paste-input').value.trim();
    if (!raw) return;
    showImportPreview(
      raw, 'import-preview', 'preview-title', 'preview-artist',
      'preview-format', 'preview-render', 'preview-save'
    );
  });

  // ── Manual import ─────────────────────────────────────────
  document.getElementById('manual-preview').addEventListener('click', () => {
    const raw = document.getElementById('manual-input').value.trim();
    if (!raw) return;
    showImportPreview(
      raw, 'manual-import-preview', 'manual-preview-title', 'manual-preview-artist',
      'manual-preview-format', 'manual-preview-render', 'manual-preview-save'
    );
  });

  // ── URL import ────────────────────────────────────────────
  document.getElementById('url-fetch').addEventListener('click', async () => {
    const url    = document.getElementById('url-input').value.trim();
    const status = document.getElementById('url-status');
    if (!url) return;

    // Apply proxy setting
    const proxy = document.getElementById('settings-proxy').value.trim();
    if (proxy) Fetcher.setProxy(proxy);

    status.textContent = 'Fetching…';
    status.style.color = 'var(--sub)';
    document.getElementById('url-fetch').disabled = true;

    try {
      const result = await Fetcher.importFromUrl(url);
      status.textContent = 'Fetched successfully.';
      status.style.color = 'var(--chord)';
      showUrlPreview(result);
    } catch(err) {
      status.textContent = 'Error: ' + err.message;
      status.style.color = 'var(--danger)';
    } finally {
      document.getElementById('url-fetch').disabled = false;
    }
  });

  function showUrlPreview(result) {
    const area = document.getElementById('url-preview');
    document.getElementById('url-preview-title').value  = result.title;
    document.getElementById('url-preview-artist').value = result.artist;
    document.getElementById('url-preview-format').textContent =
      result.format === 'chordpro' ? 'ChordPro' : 'Plain text';
    renderPreviewContent(result.content, result.format, 'url-preview-render');
    area.style.display = 'block';

    // Wire save
    const btn = document.getElementById('url-preview-save');
    const nb  = btn.cloneNode(true);
    btn.parentNode.replaceChild(nb, btn);
    nb.addEventListener('click', async () => {
      await saveImportedSong(
        document.getElementById('url-preview-title').value.trim() || 'Untitled',
        document.getElementById('url-preview-artist').value.trim(),
        result.content, result.format
      );
      area.style.display = 'none';
      document.getElementById('url-input').value = '';
      document.getElementById('url-status').textContent = '';
    });
  }

  // ── Shared import preview ─────────────────────────────────
  function showImportPreview(raw, areaId, titleId, artistId, fmtId, renderId, saveId) {
    const { format, content } = Parser.detectAndNormalise(raw);
    const meta = Parser.extractMeta(raw);

    document.getElementById(titleId).value  = meta.title;
    document.getElementById(artistId).value = meta.artist;
    document.getElementById(fmtId).textContent = format === 'chordpro' ? 'ChordPro' : 'Plain text';
    renderPreviewContent(content, format, renderId);
    document.getElementById(areaId).style.display = 'block';

    // Wire save (re-clone to avoid stacked listeners)
    const saveBtn = document.getElementById(saveId);
    const newBtn  = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newBtn, saveBtn);
    newBtn.addEventListener('click', async () => {
      await saveImportedSong(
        document.getElementById(titleId).value.trim()  || 'Untitled',
        document.getElementById(artistId).value.trim(),
        content, format
      );
      document.getElementById(areaId).style.display = 'none';
    });
  }

  function renderPreviewContent(content, format, containerId) {
    const el = document.getElementById(containerId);
    el.innerHTML = '';
    if (format === 'chordpro') {
      const sections = Parser.parseChordPro(content, 0);
      sections.slice(0, 4).forEach(sec => {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '6px';
        if (sec.label) {
          const lbl = document.createElement('div');
          lbl.className = 'section-label';
          lbl.style.fontSize = '10px';
          lbl.textContent = sec.label;
          wrapper.appendChild(lbl);
        }
        sec.rows.slice(0, 5).forEach(row => {
          const span = document.createElement('span');
          span.className = row.type === 'chord' ? 'chord-line' : 'lyric-line';
          span.style.fontSize = '12px';
          if (row.type === 'chord') {
            row.text.split(/( +)/).forEach(part => {
              if (!part.trim()) { span.appendChild(document.createTextNode(part)); }
              else {
                const cs = document.createElement('span');
                cs.className = 'chord-token'; cs.textContent = part;
                span.appendChild(cs);
              }
            });
          } else { span.textContent = row.text; }
          wrapper.appendChild(span);
        });
        el.appendChild(wrapper);
      });
      if (sections.length > 4) {
        const more = document.createElement('div');
        more.style.cssText = 'color:var(--sub);font-size:11px;margin-top:4px';
        more.textContent = `… and ${sections.length - 4} more section(s)`;
        el.appendChild(more);
      }
    } else {
      el.style.fontFamily  = 'var(--font-song)';
      el.style.fontSize    = '12px';
      el.style.whiteSpace  = 'pre-wrap';
      el.textContent = content.slice(0, 400) + (content.length > 400 ? '…' : '');
    }
  }

  async function saveImportedSong(title, artist, content, format) {
    const song = {
      id:        uuid(),
      title,
      artist,
      key:       '',
      capo:      0,
      bpm:       null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      texts: [{
        id:       uuid(),
        label:    'Original',
        format,
        content,
        language: null,
      }],
      setlistIds: [],
    };
    await DB.putSong(song);
    await loadSongs();
    showToast(`"${title}" saved.`);
    showScreen('songs');
  }

  // ── File upload ───────────────────────────────────────────
  document.getElementById('file-drop').addEventListener('click', () => {
    document.getElementById('file-input-hidden').click();
  });
  document.getElementById('file-input-hidden').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    if (file.name.endsWith('.sbook')) {
      try {
        const result = await DB.importSbook(text, false);
        await loadSongs();
        await SetlistManager.load(allSongs);
        showToast(`Imported ${result.imported} song(s). ${result.skipped} skipped.`);
      } catch(err) {
        showToast('Import failed: ' + err.message, true);
      }
    } else {
      document.getElementById('paste-input').value = text;
      showScreen('import');
      document.querySelector('[data-method="paste"]').click();
      showImportPreview(
        text, 'import-preview', 'preview-title', 'preview-artist',
        'preview-format', 'preview-render', 'preview-save'
      );
    }
    e.target.value = '';
  });

  // ── Export ────────────────────────────────────────────────
  document.getElementById('export-sbook').addEventListener('click', async () => {
    const json = await DB.exportSbook();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'songs.sbook'; a.click();
    URL.revokeObjectURL(url);
  });

  // ── Clear data ────────────────────────────────────────────
  document.getElementById('clear-data').addEventListener('click', async () => {
    if (!confirm('Delete all songs and setlists? This cannot be undone.')) return;
    const songs = await DB.getAllSongs();
    for (const s of songs) await DB.deleteSong(s.id);
    const sls = await DB.getAllSetlists();
    for (const sl of sls) await DB.deleteSetlist(sl.id);
    await loadSongs();
    await SetlistManager.load([]);
    showToast('All data cleared.');
  });

  // ── Proxy setting persistence ─────────────────────────────
  const proxyInput = document.getElementById('settings-proxy');
  DB.getSetting('proxyUrl', 'https://api.allorigins.win/get?url=').then(v => {
    proxyInput.value = v;
    Fetcher.setProxy(v);
  });
  proxyInput.addEventListener('change', () => {
    DB.setSetting('proxyUrl', proxyInput.value.trim());
    Fetcher.setProxy(proxyInput.value.trim());
  });

  // ── Toast ─────────────────────────────────────────────────
  function showToast(msg, isError = false) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.className   = 'toast' + (isError ? ' toast-error' : '');
    t.classList.add('visible');
    setTimeout(() => t.classList.remove('visible'), 3000);
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  showScreen('songs');
});
