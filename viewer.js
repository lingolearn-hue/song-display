// viewer.js v0.5 — voice page turner, setlist queue, per-song memory, BPM tap tempo

const Viewer = (() => {

  // ── State ─────────────────────────────────────────────────
  let song          = null;
  let activeTextIdx = 0;

  // ── Wake lock (prevent screen sleep during performance) ──
  let wakeLock      = null;
  let wakeTimer     = null;
  const WAKE_MS     = 10 * 60 * 1000; // 10 minutes
  let pages         = [];
  let currentPage   = 0;
  let fontSize      = 12;
  let transpose     = 0;
  let capo          = 0;
  let columns       = 1;
  let scrolling     = false;
  let scrollRaf     = null;
  let scrollSpeed   = 40;
  let scrollOffset  = 0;
  let lastTs        = null;
  let drawerOpen    = false;

  // Setlist queue
  let queue         = [];   // array of song objects
  let queueIdx      = -1;   // index of current song in queue

  // Per-song memory cache (songId → {transpose, fontSize})
  const songMemory  = {};

  const $  = id => document.getElementById(id);
  const el = {
    viewerPage:    () => $('viewer-page'),
    viewerContent: () => $('viewer-content'),
    pageCurrent:   () => $('page-current'),
    pageTotal:     () => $('page-total'),
    indicator:     () => $('page-indicator'),
    titleOverlay:  () => $('viewer-title-overlay'),
    overlayTitle:  () => $('overlay-title'),
    overlayArtist: () => $('overlay-artist'),
    drawer:        () => $('control-drawer'),
    fontVal:       () => $('font-val'),
    transposeVal:  () => $('transpose-val'),
    capoVal:       () => $('capo-val'),
    scrollToggle:  () => $('scroll-toggle'),
    textTabs:      () => $('viewer-text-tabs'),
    voiceBtn:      () => $('voice-toggle'),
    voiceStatus:   () => $('voice-status'),
    nextSongBar:   () => $('next-song-bar'),
  };

  // ── Render section ────────────────────────────────────────
  function renderLine(tokens) {
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
    return lineEl;
  }

  function renderSection(sec) {
    const frag = document.createDocumentFragment();
    if (sec.label) {
      const lbl = document.createElement('div');
      lbl.className = 'section-label';
      lbl.textContent = sec.label;
      frag.appendChild(lbl);
    }
    sec.lines.forEach(tokens => frag.appendChild(renderLine(tokens)));
    return frag;
  }

  // ── DOM-measured pagination ───────────────────────────────
  function paginate(sections) {
    const contentEl = el.viewerContent();
    const pageEl    = el.viewerPage();
    const cs        = getComputedStyle(pageEl);
    const padTop    = parseFloat(cs.paddingTop)    || 48;
    const padBottom = parseFloat(cs.paddingBottom) || 80;
    const availH    = contentEl.clientHeight - padTop - padBottom;
    const availW    = contentEl.clientWidth
                    - (parseFloat(cs.paddingLeft)  || 32)
                    - (parseFloat(cs.paddingRight) || 32);

    const probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = [
      'position:absolute','visibility:hidden','pointer-events:none',
      'top:0','left:0',
      `width:${availW}px`,
      `font-family:${cs.fontFamily}`,
      `font-size:${fontSize}px`,
      `line-height:${cs.lineHeight}`,
    ].join(';');
    if (columns === 2) { probe.style.columns = '2'; probe.style.columnGap = '40px'; }
    document.body.appendChild(probe);

    const result = []; let pageSections = []; let usedH = 0; const GAP = 8;
    sections.forEach(sec => {
      const wrapper = document.createElement('div');
      wrapper.appendChild(renderSection(sec));
      probe.innerHTML = ''; probe.appendChild(wrapper);
      const secH = wrapper.getBoundingClientRect().height;
      if (pageSections.length === 0) {
        pageSections.push({ sec, secH }); usedH = secH;
      } else if (usedH + GAP + secH <= availH) {
        pageSections.push({ sec, secH }); usedH += GAP + secH;
      } else {
        result.push(pageSections.map(x => x.sec));
        pageSections = [{ sec, secH }]; usedH = secH;
      }
    });
    if (pageSections.length) result.push(pageSections.map(x => x.sec));
    document.body.removeChild(probe);
    return result.length ? result : [[]];
  }

  // ── Show page ─────────────────────────────────────────────
  function showPage(index, fromVoice = false) {
    currentPage = Math.max(0, Math.min(index, pages.length - 1));
    const pageEl = el.viewerPage();
    pageEl.innerHTML = '';
    pageEl.style.fontSize = fontSize + 'px';
    pageEl.className = 'viewer-page' + (columns === 2 ? ' two-col' : '');
    (pages[currentPage] || []).forEach((sec, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'section-block';
      if (i > 0) wrapper.style.marginTop = '8px';
      wrapper.appendChild(renderSection(sec));
      pageEl.appendChild(wrapper);
    });
    el.pageCurrent().textContent = currentPage + 1;
    el.pageTotal().textContent   = pages.length;

    // Sync voice cursor unless the page change came from voice itself
    if (!fromVoice && Voice.isActive()) Voice.syncPage(currentPage);

    // Show next-song bar on last page if queue has more
    updateNextSongBar();
  }

  function nextPage() {
    touchActivity();
    if (currentPage < pages.length - 1) {
      flash('right'); showPage(currentPage + 1);
    } else if (queueIdx !== -1 && queueIdx < queue.length - 1) {
      showNextSongBar();
    }
  }
  function prevPage() {
    touchActivity();
    if (currentPage > 0) { flash('left'); showPage(currentPage - 1); }
  }

  function flash(dir) {
    const c = el.viewerContent();
    c.classList.remove('flash-right','flash-left');
    void c.offsetWidth;
    c.classList.add(dir === 'right' ? 'flash-right' : 'flash-left');
    setTimeout(() => c.classList.remove('flash-right','flash-left'), 200);
  }

  // ── Next-song bar ─────────────────────────────────────────
  function updateNextSongBar() {
    const bar = el.nextSongBar();
    if (!bar) return;
    const onLast = currentPage === pages.length - 1;
    const hasNext = queueIdx !== -1 && queueIdx < queue.length - 1;
    if (onLast && hasNext) {
      const next = queue[queueIdx + 1];
      bar.querySelector('.next-song-title').textContent = next.title;
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  }

  function showNextSongBar() { updateNextSongBar(); }

  function advanceQueue() {
    if (queueIdx !== -1 && queueIdx < queue.length - 1) {
      queueIdx++;
      openSong(queue[queueIdx]);
    }
  }

  // ── Re-render ─────────────────────────────────────────────
  function rerender() {
    if (!song) return;
    const text     = song.texts[activeTextIdx] || song.texts[0];
    const sections = Parser.parseChordPro(text.content, transpose);
    pages = paginate(sections);
    showPage(Math.min(currentPage, pages.length - 1));
    syncDrawer();

    // Rebuild voice word list if active
    if (Voice.isActive()) Voice.syncPage(currentPage);
  }

  // ── Text tabs ─────────────────────────────────────────────
  // Language code → flag emoji
  const LANG_FLAG = {
    'en':'🇬🇧','de':'🇩🇪','fr':'🇫🇷','es':'🇪🇸','it':'🇮🇹',
    'nl':'🇳🇱','pt':'🇧🇷','zh':'🇨🇳','zh-pinyin':'🇨🇳','la':'🏛️',
  };

  function buildTextTabs() {
    const tabBar = el.textTabs();
    tabBar.innerHTML = '';
    tabBar.innerHTML = '';
    if (!song || song.texts.length <= 1) return;
    song.texts.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.className = 'text-tab' + (i === activeTextIdx ? ' active' : '');
      const flag = text.language ? (LANG_FLAG[text.language] || '') : '';
      // Show flag if available, else label
      btn.textContent = flag ? flag + ' ' + (text.label || '') : (text.label || 'Text ' + (i+1));
      btn.title = text.label || '';
      btn.addEventListener('click', () => {
        activeTextIdx = i; buildTextTabs(); currentPage = 0; rerender();
      });
      tabBar.appendChild(btn);
    });
  }

  // ── Autoscroll ────────────────────────────────────────────
  function startScroll() {
    if (!song) return;
    scrolling = true;
    document.body.classList.add('scrolling');
    el.indicator().style.opacity = '0';

    const text     = song.texts[activeTextIdx] || song.texts[0];
    const sections = Parser.parseChordPro(text.content, transpose);
    const pageEl   = el.viewerPage();
    pageEl.innerHTML = ''; pageEl.style.fontSize = fontSize + 'px';
    pageEl.style.height = 'auto'; pageEl.style.overflow = 'visible';
    pageEl.className = 'viewer-page' + (columns === 2 ? ' two-col' : '');
    sections.forEach((sec, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'section-block';
      if (i > 0) wrapper.style.marginTop = '8px';
      wrapper.appendChild(renderSection(sec));
      pageEl.appendChild(wrapper);
    });

    el.viewerContent().style.overflowY = 'auto';
    lastTs = null; scrollOffset = el.viewerContent().scrollTop;
    scrollRaf = requestAnimationFrame(scrollTick);
    el.scrollToggle().textContent = '■ Stop';
    el.scrollToggle().classList.add('active');
  }

  function stopScroll() {
    scrolling = false;
    document.body.classList.remove('scrolling');
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    scrollRaf = null;
    el.indicator().style.opacity = '';
    el.viewerContent().style.overflowY = 'hidden';
    el.viewerPage().style.height = ''; el.viewerPage().style.overflow = '';
    el.scrollToggle().textContent = '▶ Start';
    el.scrollToggle().classList.remove('active');
    rerender();
  }

  function scrollTick(ts) {
    if (!scrolling) return;
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000; lastTs = ts;
    scrollOffset += scrollSpeed * dt;
    const c = el.viewerContent();
    c.scrollTop = scrollOffset;
    if (c.scrollTop >= c.scrollHeight - c.clientHeight - 4) { stopScroll(); return; }
    scrollRaf = requestAnimationFrame(scrollTick);
  }

  // ── Drawer ────────────────────────────────────────────────
  function openDrawer()   { drawerOpen = true;  el.drawer().classList.remove('hidden'); }
  function closeDrawer()  { drawerOpen = false; el.drawer().classList.add('hidden'); }
  function toggleDrawer() { drawerOpen ? closeDrawer() : openDrawer(); }

  function syncDrawer() {
    el.fontVal().textContent = fontSize;
    el.transposeVal().textContent = transpose === 0 ? '0' : (transpose > 0 ? '+' : '') + transpose;
    el.capoVal().textContent = capo;
    const sfv = $('settings-font-val');
    if (sfv) sfv.textContent = fontSize;
  }

  // ── Per-song memory ───────────────────────────────────────
  function saveMemory() {
    if (!song) return;
    songMemory[song.id] = { transpose, fontSize };
    DB.setSetting('songMemory', JSON.stringify(songMemory));
  }

  async function loadMemory() {
    const raw = await DB.getSetting('songMemory', '{}');
    try {
      const data = JSON.parse(raw);
      Object.assign(songMemory, data);
    } catch(_) {}
  }

  function applyMemory() {
    if (!song) return;
    const mem = songMemory[song.id];
    if (mem) {
      if (mem.transpose !== undefined) transpose = mem.transpose;
      if (mem.fontSize  !== undefined) fontSize  = mem.fontSize;
    }
  }

  // ── Title overlay ─────────────────────────────────────────
  function showTitleOverlay() {
    el.overlayTitle().textContent  = song.title;
    el.overlayArtist().textContent = song.artist || '';
    const ov = el.titleOverlay();
    ov.classList.add('visible');
    setTimeout(() => ov.classList.remove('visible'), 2400);
  }

  // ── Wake lock helpers ────────────────────────────────────
  async function acquireWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      // Release existing lock first
      if (wakeLock) { await wakeLock.release(); wakeLock = null; }
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch (_) { /* API unavailable or permission denied — silent */ }
  }

  function releaseWakeLock() {
    clearTimeout(wakeTimer);
    wakeTimer = null;
    if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
  }

  // Call on any user activity in the viewer — resets the 10-min timer
  function touchActivity() {
    acquireWakeLock();
    clearTimeout(wakeTimer);
    wakeTimer = setTimeout(releaseWakeLock, WAKE_MS);
  }

  // ── Open a song ───────────────────────────────────────────
  function openSong(songData) {
    // Save memory for previous song
    if (song) saveMemory();

    song          = songData;
    activeTextIdx = 0;
    capo          = song.capo || 0;
    currentPage   = 0;
    scrollOffset  = 0;
    transpose     = 0;   // will be overridden by memory if present
    if (scrolling) stopScroll();
    if (Voice.isActive()) stopVoice();
    closeDrawer();
    applyMemory();       // restore per-song settings
    buildTextTabs();
    rerender();
    showTitleOverlay();
    updateNextSongBar();
    touchActivity();     // acquire wake lock, reset timer
  }

  // ── Voice ─────────────────────────────────────────────────
  function startVoice() {
    const text     = song.texts[activeTextIdx] || song.texts[0];
    const sections = Parser.parseChordPro(text.content, transpose);
    const builtPages = pages.length ? pages : paginate(sections);

    // Detect language from text
    const lang = text.language || 'en-US';
    const srLang = lang === 'zh' || lang === 'zh-pinyin' ? 'zh-CN'
                 : lang === 'de' ? 'de-DE'
                 : lang === 'fr' ? 'fr-FR'
                 : lang === 'es' ? 'es-ES'
                 : lang === 'it' ? 'it-IT'
                 : lang === 'nl' ? 'nl-NL'
                 : lang === 'pt' ? 'pt-PT'
                 : 'en-US';

    const started = Voice.start(builtPages, currentPage, {
      onPageChange: (pageIdx) => {
        if (pageIdx !== currentPage) {
          flash('right');
          showPage(pageIdx, true);
        }
      },
      onStatus: (msg) => {
        const s = el.voiceStatus();
        if (s) s.textContent = msg;
      },
    });

    if (started) {
      el.voiceBtn().classList.add('active');
      el.voiceBtn().textContent = '🎤 Stop';
      document.body.classList.add('voice-active');
    }
  }

  function stopVoice() {
    Voice.stop();
    el.voiceBtn().classList.remove('active');
    el.voiceBtn().textContent = '🎤 Voice';
    const s = el.voiceStatus();
    if (s) s.textContent = '';
    document.body.classList.remove('voice-active');
  }

  function toggleVoice() {
    Voice.isActive() ? stopVoice() : startVoice();
  }

  // ── Public: open with optional queue ─────────────────────
  function open(songData, queueData, queuePosition) {
    queue    = queueData    || [];
    queueIdx = queuePosition !== undefined ? queuePosition : -1;
    openSong(songData);
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    // Display options button
    const dispBtn = $('display-options-btn');
    if (dispBtn) dispBtn.addEventListener('click', toggleDrawer);

    // ── Swipe + tap on full viewer screen to flip pages ────────
    const viewerScreen = document.getElementById('screen-viewer');
    const TOPBAR_H = 44; // px — ignore touches in the top bar area
    let swipeX = 0, swipeY = 0, swipeT = 0, didMove = false;

    viewerScreen.addEventListener('touchstart', e => {
      swipeX = e.touches[0].clientX;
      swipeY = e.touches[0].clientY;
      swipeT = Date.now();
      didMove = false;
    }, { passive: true });

    viewerScreen.addEventListener('touchmove', e => {
      // Only count as moved if finger travelled > 8px (filters micro-jitter)
      const dx = Math.abs(e.touches[0].clientX - swipeX);
      const dy = Math.abs(e.touches[0].clientY - swipeY);
      if (dx > 8 || dy > 8) didMove = true;
    }, { passive: true });

    viewerScreen.addEventListener('touchend', e => {
      if (scrolling) return;
      // Ignore touches in the top bar
      if (swipeY < TOPBAR_H) return;
      // If drawer is open, only close if touch was OUTSIDE the drawer
      if (drawerOpen) {
        const drawer = document.getElementById('control-drawer');
        if (drawer && drawer.contains(e.target)) return; // touch inside drawer — ignore
        closeDrawer();
        return;
      }

      const dx = e.changedTouches[0].clientX - swipeX;
      const dy = e.changedTouches[0].clientY - swipeY;
      const dt = Date.now() - swipeT;

      if (didMove) {
        // ── Swipe ──
        if (dt > 500) return;
        if (Math.abs(dy) > Math.abs(dx)) return; // too vertical
        if (Math.abs(dx) < 40) return;           // too short
        dx < 0 ? nextPage() : prevPage();
      } else {
        // ── Tap ──
        if (dt > 400) return; // held too long
        const W = viewerScreen.clientWidth;
        swipeX < W * 0.35 ? prevPage() : nextPage();
      }
    }, { passive: true });


    document.addEventListener('keydown', e => {
      if (!document.body.classList.contains('viewing')) return;
      if (['ArrowRight','ArrowDown',' '].includes(e.key)) { e.preventDefault(); if (!scrolling) nextPage(); }
      if (['ArrowLeft','ArrowUp'].includes(e.key))        { e.preventDefault(); if (!scrolling) prevPage(); }
      if (e.key === 'Escape') { closeDrawer(); stopVoice(); }
    });

    $('font-up').addEventListener('click',        () => { fontSize = Math.min(28, fontSize+1); saveMemory(); rerender(); });
    $('font-down').addEventListener('click',      () => { fontSize = Math.max(11, fontSize-1); saveMemory(); rerender(); });
    $('transpose-up').addEventListener('click',   () => { transpose = transpose + 1; saveMemory(); rerender(); });
    $('transpose-down').addEventListener('click', () => { transpose = transpose - 1; saveMemory(); rerender(); });
    $('capo-up').addEventListener('click',        () => { capo = Math.min(9, capo+1); el.capoVal().textContent = capo; });
    $('capo-down').addEventListener('click',      () => { capo = Math.max(0, capo-1); el.capoVal().textContent = capo; });
    $('scroll-toggle').addEventListener('click',  () => scrolling ? stopScroll() : startScroll());
    $('scroll-faster').addEventListener('click',  () => { scrollSpeed = Math.min(200, scrollSpeed+8); });
    $('scroll-slower').addEventListener('click',  () => { scrollSpeed = Math.max(8,   scrollSpeed-8); });

    // Voice toggle
    $('voice-toggle').addEventListener('click', toggleVoice);

    // Next-song bar
    const nextBar = $('next-song-bar');
    if (nextBar) {
      nextBar.querySelector('.next-song-advance').addEventListener('click', advanceQueue);
      nextBar.querySelector('.next-song-dismiss').addEventListener('click', () => {
        nextBar.classList.remove('visible');
      });
    }

    document.querySelectorAll('.layout-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        columns = parseInt(btn.dataset.cols);
        rerender();
      });
    });

    function syncNight(on) {
      document.body.classList.toggle('day-mode', !on);
      ['night-toggle','settings-night-toggle'].forEach(id => { const t = $(id); if (t) t.classList.toggle('on', on); });
      DB.setSetting('nightMode', on);
    }
    $('night-toggle').addEventListener('click',          function() { syncNight(!this.classList.contains('on')); });
    $('settings-night-toggle').addEventListener('click', function() { syncNight(!this.classList.contains('on')); });
    $('settings-font-up').addEventListener('click',      () => { fontSize = Math.min(28, fontSize+1); rerender(); });
    $('settings-font-down').addEventListener('click',    () => { fontSize = Math.max(11, fontSize-1); rerender(); });

    let ty0 = 0;
    el.drawer().addEventListener('touchstart', e => { ty0 = e.touches[0].clientY; }, { passive: true });
    el.drawer().addEventListener('touchend',   e => { if (e.changedTouches[0].clientY - ty0 > 60) closeDrawer(); }, { passive: true });

    DB.getSetting('fontSize',  12).then(v => { fontSize = v; syncDrawer(); });

    // Re-acquire wake lock if page becomes visible again while in viewer
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && song && wakeTimer) {
        acquireWakeLock();
      } else if (document.visibilityState === 'hidden') {
        // Release on hide — OS will have released it anyway
        if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
      }
    });

    // Listen for BPM-derived scroll speed from app.js
    document.addEventListener('set-scroll-speed', e => {
      scrollSpeed = e.detail;
    });
    DB.getSetting('nightMode', true).then(v => syncNight(v));
    loadMemory();
  }

  return { init, open, releaseWakeLock };
})();
