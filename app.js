// app.js v0.3

document.addEventListener('DOMContentLoaded', async () => {

  // ── Boot ──────────────────────────────────────────────────
  await DB.open();
  await DB.migrate();   // runs data migrations, seeds if empty
  Viewer.init();
  Editor.init();

  // ── OCR init ──────────────────────────────────────────────
  OCR.init((chordproText) => {
    // OCR result → feed into paste preview
    document.getElementById('paste-input').value = chordproText;
    document.querySelector('[data-method="paste"]').click();
    showImportPreview(
      chordproText, 'import-preview', 'preview-title', 'preview-artist',
      'preview-format', 'preview-render', 'preview-save'
    );
  });

  // ── BPM tap tempo ─────────────────────────────────────────
  let tapTimes = [];
  document.getElementById('tap-tempo-btn').addEventListener('click', () => {
    const now = Date.now();
    tapTimes.push(now);
    // Keep last 8 taps
    if (tapTimes.length > 8) tapTimes.shift();
    // Reset if gap > 3 seconds
    if (tapTimes.length > 1 && now - tapTimes[tapTimes.length - 2] > 3000) {
      tapTimes = [now];
    }
    if (tapTimes.length >= 2) {
      const gaps = [];
      for (let i = 1; i < tapTimes.length; i++) gaps.push(tapTimes[i] - tapTimes[i-1]);
      const avgGap = gaps.reduce((a,b) => a+b, 0) / gaps.length;
      const bpm = Math.round(60000 / avgGap);
      document.getElementById('tap-tempo-val').textContent = bpm;
    } else {
      document.getElementById('tap-tempo-val').textContent = '…';
    }
  });

  document.getElementById('tap-tempo-use').addEventListener('click', () => {
    const val = document.getElementById('tap-tempo-val').textContent;
    const bpm = parseInt(val);
    if (!bpm) return;
    // Map BPM to scroll speed: 60bpm ≈ speed 30, 120bpm ≈ speed 60
    // Formula: speed = bpm * 0.5
    const speed = Math.max(8, Math.min(200, Math.round(bpm * 0.5)));
    // Store in viewer via a custom event
    document.dispatchEvent(new CustomEvent('set-scroll-speed', { detail: speed }));
    showToast('Scroll speed set from ' + bpm + ' BPM');
  });

  // OCR reset button
  document.getElementById('ocr-reset').addEventListener('click', () => {
    document.getElementById('ocr-correction-panel').style.display = 'none';
    document.getElementById('ocr-actions').style.display = 'none';
    document.getElementById('ocr-status-bar').style.display = 'none';
    document.getElementById('ocr-drop').style.display = 'block';
    document.getElementById('ocr-status').textContent = '';
  });

  // ── Service worker version notifications ──────────────────
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data && e.data.type === 'NEW_VERSION') {
        showUpdateBanner();
      }
    });
  }

  function showUpdateBanner() {
    let banner = document.getElementById('update-banner');
    if (banner) return;  // already showing
    banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.className = 'update-banner';
    banner.innerHTML = 'New version available. <button id="update-reload">Reload</button>';
    document.body.appendChild(banner);
    document.getElementById('update-reload').addEventListener('click', () => {
      window.location.reload();
    });
  }

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
  document.getElementById('viewer-back').addEventListener('click', () => {
    Viewer.releaseWakeLock();
    showScreen('songs');
  });
  // Edit song now lives in display options drawer
  document.getElementById('drawer-edit-song').addEventListener('click', () => {
    if (currentViewerSong) {
      // Close drawer first
      document.getElementById('control-drawer').classList.add('hidden');
      openEditor(currentViewerSong);
    }
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

  // ── Language → flag mapping ──────────────────────────────
  const LANG_FLAG = {
    'en': '🇬🇧', 'de': '🇩🇪', 'fr': '🇫🇷', 'es': '🇪🇸',
    'it': '🇮🇹', 'nl': '🇳🇱', 'pt': '🇧🇷', 'zh': '🇨🇳',
    'zh-pinyin': '🇨🇳', 'la': '🏛️',
  };
  const LANG_NAME = {
    'en': 'English', 'de': 'German', 'fr': 'French', 'es': 'Spanish',
    'it': 'Italian', 'nl': 'Dutch', 'pt': 'Portuguese', 'zh': 'Chinese',
    'zh-pinyin': 'Pinyin', 'la': 'Latin',
  };

  function songPrimaryLang(song) {
    return song.texts && song.texts[0] ? (song.texts[0].language || 'en') : 'en';
  }

  function tagEmoji(tag) {
    const map = { christmas:'🎄', folk:'🪕', hymn:'⛪', anthem:'🏛️',
                  lullaby:'🌙', spiritual:'✝️', classical:'🎼', traditional:'🎵' };
    return map[tag] || '🏷';
  }

  // Show placeholder text in select when nothing is selected
  function updateSelectPlaceholder(sel, placeholder) {
    const hasSelection = [...sel.options].some(o => o.selected);
    if (!hasSelection) {
      // Insert placeholder as first non-selectable option
      const ph = document.createElement('option');
      ph.value = '';
      ph.disabled = true;
      ph.selected = true;
      ph.textContent = placeholder;
      ph.style.color = 'var(--sub)';
      sel.insertBefore(ph, sel.firstChild);
    }
  }

  // ── Native <select multiple> filters ─────────────────────
  function buildFilterRow() {
    const langs = new Set();
    const tags  = new Set();
    allSongs.forEach(s => {
      if (s.texts) s.texts.forEach(t => { if (t.language) langs.add(t.language); });
      if (s.tags)  s.tags.forEach(t => tags.add(t));
    });

    // Populate language select
    const langSel = document.getElementById('lang-filter');
    const prevLangs = [...langSel.options].filter(o => o.selected && o.value).map(o => o.value);
    langSel.innerHTML = '';
    [...langs].sort().forEach(lang => {
      const opt = document.createElement('option');
      opt.value = lang;
      opt.textContent = (LANG_FLAG[lang] || '🌐') + ' ' + (LANG_NAME[lang] || lang);
      opt.selected = prevLangs.includes(lang);
      langSel.appendChild(opt);
    });
    updateSelectPlaceholder(langSel, '🌐 Language');

    // Populate tag select
    const tagSel = document.getElementById('tag-filter');
    const prevTags = [...tagSel.options].filter(o => o.selected && o.value).map(o => o.value);
    tagSel.innerHTML = '';
    [...tags].sort().forEach(tag => {
      const opt = document.createElement('option');
      opt.value = tag;
      opt.textContent = tagEmoji(tag) + ' ' + tag;
      opt.selected = prevTags.includes(tag);
      tagSel.appendChild(opt);
    });
    updateSelectPlaceholder(tagSel, '🏷 Category');

    updateClearBtn();
  }

  function getSelectedFilters() {
    const langSel = document.getElementById('lang-filter');
    const tagSel  = document.getElementById('tag-filter');
    const langs = new Set([...langSel.options].filter(o => o.selected && o.value).map(o => o.value));
    const tags  = new Set([...tagSel.options].filter(o => o.selected && o.value).map(o => o.value));
    return { langs, tags };
  }

  function updateClearBtn() {
    const { langs, tags } = getSelectedFilters();
    const btn = document.getElementById('filter-clear');
    if (btn) btn.classList.toggle('hidden', langs.size === 0 && tags.size === 0);
  }

  function songMatchesFilters(song) {
    const { langs, tags } = getSelectedFilters();
    if (langs.size > 0) {
      // AND logic: song must have a text in EACH of the selected languages
      const songLangs = new Set((song.texts || []).map(t => t.language));
      if (![...langs].every(l => songLangs.has(l))) return false;
    }
    if (tags.size > 0) {
      const songTags = new Set(song.tags || []);
      if (![...tags].every(t => songTags.has(t))) return false;
    }
    return true;
  }

  // Wire filter change events once
  function initFilters() {
    const onFilterChange = (sel, placeholder) => {
      // Remove placeholder option once user makes a real selection
      const ph = [...sel.options].find(o => !o.value);
      if (ph && [...sel.options].some(o => o.selected && o.value)) {
        sel.removeChild(ph);
      } else if (!ph && ![...sel.options].some(o => o.selected)) {
        updateSelectPlaceholder(sel, placeholder);
      }
      updateClearBtn();
      renderSongList(searchEl.value);
    };
    document.getElementById('lang-filter').addEventListener('change', function() {
      onFilterChange(this, '🌐 Language');
    });
    document.getElementById('tag-filter').addEventListener('change', function() {
      onFilterChange(this, '🏷 Category');
    });
    document.getElementById('filter-clear').addEventListener('click', () => {
      buildFilterRow();  // rebuild fully — easiest way to reset to placeholder state
      renderSongList(searchEl.value);
    });
  }

  function renderSongList(filter = '') {
    const q = filter.toLowerCase();
    const list = allSongs.filter(s =>
      (s.title.toLowerCase().includes(q) || (s.artist || '').toLowerCase().includes(q))
      && songMatchesFilters(s)
    );
    songListEl.innerHTML = '';
    if (!list.length) {
      songListEl.innerHTML = '<div class="list-empty">No songs found</div>';
      return;
    }
    list.forEach(song => {
      const primaryLang = songPrimaryLang(song);
      const flag = LANG_FLAG[primaryLang] || '';
      const item = document.createElement('div');
      item.className = 'song-item';
      item.innerHTML = `
        <div class="song-item-info">
          <div class="song-item-title">${esc(song.title)}</div>
          <div class="song-item-artist">${esc(song.artist || '')}</div>
        </div>
        <div class="song-item-actions">
          <span class="song-item-flag" title="${esc(LANG_NAME[primaryLang] || primaryLang)}">${flag}</span>
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
  buildFilterRow();
  initFilters();

  function openSong(song, queueData, queueIdx) {
    currentViewerSong = song;
    showScreen('viewer');
    Viewer.open(song, queueData, queueIdx);
  }

  // Open a song from setlist with full queue
  function openSongInQueue(songs, idx) {
    openSong(songs[idx], songs, idx);
  }

  function openEditor(song) {
    Editor.open(song, async (saved) => {
      await loadSongs();
      buildFilterRow();
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
    el.style.fontSize = '13px';
    el.innerHTML = '';
    if (format === 'chordpro') {
      const sections = Parser.parseChordPro(content, 0);
      sections.slice(0, 4).forEach(sec => {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-block';
        wrapper.style.marginBottom = '6px';
        if (sec.label) {
          const lbl = document.createElement('div');
          lbl.className = 'section-label';
          lbl.textContent = sec.label;
          wrapper.appendChild(lbl);
        }
        sec.lines.slice(0, 6).forEach(tokens => {
          const lineEl = document.createElement('div');
          lineEl.className = 'lyric-line';
          const hasChords = tokens.some(t => t.chord);
          if (hasChords) lineEl.classList.add('has-chords');
          tokens.forEach(tok => {
            if (tok.chord) {
              const wrap = document.createElement('span');
              wrap.className = 'chord-wrap';
              const ch = document.createElement('span');
              ch.className = 'chord-above';
              ch.textContent = tok.chord;
              wrap.appendChild(ch);
              if (tok.text) wrap.appendChild(document.createTextNode(tok.text));
              lineEl.appendChild(wrap);
            } else if (tok.text) {
              lineEl.appendChild(document.createTextNode(tok.text));
            }
          });
          wrapper.appendChild(lineEl);
        });
        el.appendChild(wrapper);
      });
      if (sections.length > 4) {
        const more = document.createElement('div');
        more.style.cssText = 'color:var(--sub);font-size:11px;margin-top:4px';
        more.textContent = '… and ' + (sections.length - 4) + ' more section(s)';
        el.appendChild(more);
      }
    } else {
      el.style.fontFamily = 'var(--font-song)';
      el.style.whiteSpace = 'pre-wrap';
      el.textContent = content.slice(0, 400) + (content.length > 400 ? '…' : '');
    }
  }

  function autoDetectKey(chordproContent) {
    // Find first [Chord] token and use its root as the key
    const m = chordproContent.match(/\[([A-G][#b]?)/);
    return m ? m[1] : '';
  }

  async function saveImportedSong(title, artist, content, format) {
    const song = {
      id:        uuid(),
      title,
      artist,
      key:       format === 'chordpro' ? autoDetectKey(content) : '',
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
  const fileDropEl  = document.getElementById('file-drop');
  const fileInputEl = document.getElementById('file-input-hidden');

  fileDropEl.addEventListener('click', () => fileInputEl.click());

  // Drag-and-drop on the drop zone
  fileDropEl.addEventListener('dragover', e => {
    e.preventDefault();
    fileDropEl.classList.add('drop-active');
  });
  fileDropEl.addEventListener('dragleave', () => {
    fileDropEl.classList.remove('drop-active');
  });
  fileDropEl.addEventListener('drop', async e => {
    e.preventDefault();
    fileDropEl.classList.remove('drop-active');
    const file = e.dataTransfer.files[0];
    if (file) await handleFileImport(file);
  });

  fileInputEl.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (file) await handleFileImport(file);
    e.target.value = '';
  });

  async function handleFileImport(file) {
    const name = file.name.toLowerCase();
    // Read as text — .sbook is JSON, everything else is text
    let text;
    try {
      text = await file.text();
    } catch(err) {
      showToast('Could not read file: ' + err.message, true);
      return;
    }

    if (name.endsWith('.sbook')) {
      // Validate it looks like JSON before parsing
      const trimmed = text.trim();
      if (!trimmed.startsWith('{')) {
        showToast('Invalid .sbook file — expected JSON.', true);
        return;
      }
      try {
        const result = await DB.importSbook(trimmed, false);
        await loadSongs();
        await SetlistManager.load(allSongs);
        showToast(`Imported ${result.imported} song(s). ${result.skipped} already existed.`);
        showScreen('songs');
      } catch(err) {
        showToast('Import failed: ' + err.message, true);
      }
    } else {
      // Treat as song text — feed into paste preview
      document.getElementById('paste-input').value = text;
      showScreen('import');
      document.querySelector('[data-method="paste"]').click();
      showImportPreview(
        text, 'import-preview', 'preview-title', 'preview-artist',
        'preview-format', 'preview-render', 'preview-save'
      );
    }
  }

  // ── Export ────────────────────────────────────────────────
  document.getElementById('export-sbook').addEventListener('click', async () => {
    const json = await DB.exportSbook();
    // Use text/plain so browsers don't mangle the download across all platforms
    const blob = new Blob([json], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'songs.sbook'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
