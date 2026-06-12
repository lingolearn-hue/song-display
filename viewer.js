// viewer.js v0.4 — ruby-style chord rendering, DOM-measured pagination

const Viewer = (() => {

  let song          = null;
  let activeTextIdx = 0;
  let pages         = [];
  let currentPage   = 0;
  let fontSize      = 16;
  let transpose     = 0;
  let capo          = 0;
  let columns       = 1;
  let scrolling     = false;
  let scrollRaf     = null;
  let scrollSpeed   = 40;
  let scrollOffset  = 0;
  let lastTs        = null;
  let drawerOpen    = false;

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
  };

  // ── Render a line of tokens (ruby-style) ─────────────────
  // Each token = { chord: string|null, text: string }
  // Tokens with a chord render as an inline wrapper with the chord
  // floating above via ::before / absolute positioning.
  function renderLine(tokens) {
    const lineEl = document.createElement('div');
    lineEl.className = 'lyric-line';

    // Check if any token in this line has a chord
    const hasChords = tokens.some(t => t.chord);
    if (hasChords) lineEl.classList.add('has-chords');

    tokens.forEach(tok => {
      if (tok.chord) {
        // Wrapper: chord floats above the text
        const wrap = document.createElement('span');
        wrap.className = 'chord-wrap';

        const chEl = document.createElement('span');
        chEl.className = 'chord-above';
        chEl.textContent = tok.chord;

        wrap.appendChild(chEl);

        if (tok.text) {
          wrap.appendChild(document.createTextNode(tok.text));
        }
        lineEl.appendChild(wrap);
      } else if (tok.text) {
        // Plain text — no chord above
        lineEl.appendChild(document.createTextNode(tok.text));
      }
    });

    return lineEl;
  }

  // ── Render a full section to a DOM element ───────────────
  function renderSection(sec) {
    const frag = document.createDocumentFragment();

    if (sec.label) {
      const lbl = document.createElement('div');
      lbl.className = 'section-label';
      lbl.textContent = sec.label;
      frag.appendChild(lbl);
    }

    sec.lines.forEach(tokens => {
      frag.appendChild(renderLine(tokens));
    });

    return frag;
  }

  // ── DOM-measured pagination ──────────────────────────────
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
      'position:absolute', 'visibility:hidden', 'pointer-events:none',
      'top:0', 'left:0',
      `width:${availW}px`,
      `font-family:${cs.fontFamily}`,
      `font-size:${fontSize}px`,
      `line-height:${cs.lineHeight}`,
    ].join(';');
    if (columns === 2) { probe.style.columns = '2'; probe.style.columnGap = '40px'; }
    document.body.appendChild(probe);

    const result       = [];
    let   pageSections = [];
    let   usedH        = 0;
    const GAP          = 8;

    sections.forEach(sec => {
      const wrapper = document.createElement('div');
      wrapper.appendChild(renderSection(sec));
      probe.innerHTML = '';
      probe.appendChild(wrapper);
      const secH = wrapper.getBoundingClientRect().height;

      if (pageSections.length === 0) {
        pageSections.push({ sec, secH });
        usedH = secH;
      } else if (usedH + GAP + secH <= availH) {
        pageSections.push({ sec, secH });
        usedH += GAP + secH;
      } else {
        result.push(pageSections.map(x => x.sec));
        pageSections = [{ sec, secH }];
        usedH = secH;
      }
    });

    if (pageSections.length) result.push(pageSections.map(x => x.sec));
    document.body.removeChild(probe);
    return result.length ? result : [[]];
  }

  // ── Display a page ───────────────────────────────────────
  function showPage(index) {
    currentPage = Math.max(0, Math.min(index, pages.length - 1));
    const pageEl = el.viewerPage();
    pageEl.innerHTML  = '';
    pageEl.style.fontSize = fontSize + 'px';
    pageEl.className  = 'viewer-page' + (columns === 2 ? ' two-col' : '');

    (pages[currentPage] || []).forEach((sec, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'section-block';
      if (i > 0) wrapper.style.marginTop = '8px';
      wrapper.appendChild(renderSection(sec));
      pageEl.appendChild(wrapper);
    });

    el.pageCurrent().textContent = currentPage + 1;
    el.pageTotal().textContent   = pages.length;
  }

  function nextPage() { if (currentPage < pages.length - 1) { flash('right'); showPage(currentPage + 1); } }
  function prevPage() { if (currentPage > 0)                { flash('left');  showPage(currentPage - 1); } }

  function flash(dir) {
    const c = el.viewerContent();
    c.classList.remove('flash-right', 'flash-left');
    void c.offsetWidth;
    c.classList.add(dir === 'right' ? 'flash-right' : 'flash-left');
    setTimeout(() => c.classList.remove('flash-right', 'flash-left'), 200);
  }

  // ── Re-render ─────────────────────────────────────────────
  function rerender() {
    if (!song) return;
    const text     = song.texts[activeTextIdx] || song.texts[0];
    const sections = Parser.parseChordPro(text.content, transpose);
    pages = paginate(sections);
    showPage(Math.min(currentPage, pages.length - 1));
    syncDrawer();
  }

  // ── Text tabs ─────────────────────────────────────────────
  function buildTextTabs() {
    const tabBar = el.textTabs();
    tabBar.innerHTML = '';
    if (!song || song.texts.length <= 1) { tabBar.style.display = 'none'; return; }
    tabBar.style.display = 'flex';
    song.texts.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.className = 'text-tab' + (i === activeTextIdx ? ' active' : '');
      btn.textContent = text.label || ('Text ' + (i + 1));
      btn.addEventListener('click', () => { activeTextIdx = i; buildTextTabs(); currentPage = 0; rerender(); });
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
    pageEl.innerHTML  = '';
    pageEl.style.fontSize = fontSize + 'px';
    pageEl.style.height   = 'auto';
    pageEl.style.overflow = 'visible';
    pageEl.className      = 'viewer-page' + (columns === 2 ? ' two-col' : '');

    sections.forEach((sec, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'section-block';
      if (i > 0) wrapper.style.marginTop = '8px';
      wrapper.appendChild(renderSection(sec));
      pageEl.appendChild(wrapper);
    });

    el.viewerContent().style.overflowY = 'auto';
    lastTs = null;
    scrollOffset = el.viewerContent().scrollTop;
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
    el.viewerPage().style.height   = '';
    el.viewerPage().style.overflow = '';
    el.scrollToggle().textContent = '▶ Start';
    el.scrollToggle().classList.remove('active');
    rerender();
  }

  function scrollTick(ts) {
    if (!scrolling) return;
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
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

  function showTitleOverlay() {
    el.overlayTitle().textContent  = song.title;
    el.overlayArtist().textContent = song.artist || '';
    const ov = el.titleOverlay();
    ov.classList.add('visible');
    setTimeout(() => ov.classList.remove('visible'), 2400);
  }

  // ── Open a song ───────────────────────────────────────────
  function open(songData) {
    song          = songData;
    activeTextIdx = 0;
    transpose     = 0;
    capo          = song.capo || 0;
    currentPage   = 0;
    scrollOffset  = 0;
    if (scrolling) stopScroll();
    closeDrawer();
    buildTextTabs();
    rerender();
    showTitleOverlay();
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    $('tap-next').addEventListener('click', () => { if (drawerOpen) { closeDrawer(); return; } if (!scrolling) nextPage(); });
    $('tap-prev').addEventListener('click', () => { if (drawerOpen) { closeDrawer(); return; } if (!scrolling) prevPage(); });
    $('tap-menu').addEventListener('click', toggleDrawer);

    document.addEventListener('keydown', e => {
      if (!document.body.classList.contains('viewing')) return;
      if (['ArrowRight','ArrowDown',' '].includes(e.key)) { e.preventDefault(); if (!scrolling) nextPage(); }
      if (['ArrowLeft','ArrowUp'].includes(e.key))        { e.preventDefault(); if (!scrolling) prevPage(); }
      if (e.key === 'Escape') closeDrawer();
    });

    $('font-up').addEventListener('click',        () => { fontSize = Math.min(28, fontSize+1); rerender(); });
    $('font-down').addEventListener('click',      () => { fontSize = Math.max(11, fontSize-1); rerender(); });
    $('transpose-up').addEventListener('click',   () => { transpose = Math.min(6,  transpose+1); rerender(); });
    $('transpose-down').addEventListener('click', () => { transpose = Math.max(-6, transpose-1); rerender(); });
    $('capo-up').addEventListener('click',        () => { capo = Math.min(9, capo+1); el.capoVal().textContent = capo; });
    $('capo-down').addEventListener('click',      () => { capo = Math.max(0, capo-1); el.capoVal().textContent = capo; });
    $('scroll-toggle').addEventListener('click',  () => scrolling ? stopScroll() : startScroll());
    $('scroll-faster').addEventListener('click',  () => { scrollSpeed = Math.min(200, scrollSpeed+8); });
    $('scroll-slower').addEventListener('click',  () => { scrollSpeed = Math.max(8,   scrollSpeed-8); });

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

    DB.getSetting('fontSize',  16).then(v => { fontSize = v; syncDrawer(); });
    DB.getSetting('nightMode', true).then(v => syncNight(v));
  }

  return { init, open };
})();
