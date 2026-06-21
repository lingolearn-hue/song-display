// ocr.js v0.4 — Tesseract.js OCR with chord-line detection and correction UI

const OCR = (() => {

  // Tesseract is loaded from CDN in index.html
  // We use the v4 API: Tesseract.recognize(image, lang, options)

  let currentRawLines = [];   // lines as OCR returned them
  let currentEdited   = [];   // lines after user edits
  let onResult = null;        // callback(chordproText)

  const $ = id => document.getElementById(id);

  // ── Lazy-load Tesseract.js only when OCR is first used ───
  let tesseractLoadPromise = null;
  function loadTesseract() {
    if (window.Tesseract) return Promise.resolve();
    if (tesseractLoadPromise) return tesseractLoadPromise;
    tesseractLoadPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      s.onload  = resolve;
      s.onerror = () => reject(new Error('Could not load OCR engine — check your connection'));
      document.head.appendChild(s);
    });
    return tesseractLoadPromise;
  }

  // ── Run OCR on an image file ──────────────────────────────
  async function recognise(file) {
    setStatus('Loading OCR engine…', 0);
    await loadTesseract();
    setStatus('Initialising OCR engine…', 0);

    const result = await Tesseract.recognize(file, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          setStatus('Recognising text…', Math.round(m.progress * 100));
        }
      },
    });

    const lines = result.data.lines.map(l => l.text.replace(/\n$/, ''));
    currentRawLines = lines;
    currentEdited   = [...lines];
    setStatus('Done', 100);
    return lines;
  }

  // ── Annotate lines: detect which are chord lines ──────────
  function annotateLines(lines) {
    return lines.map(line => ({
      text: line,
      isChord: Parser.isChordLine(line),
    }));
  }

  // ── Render correction UI ──────────────────────────────────
  function renderCorrectionUI(imageFile, lines) {
    const panel = $('ocr-correction-panel');
    panel.style.display = 'grid';

    // Left: image preview
    const imgEl = $('ocr-image-preview');
    imgEl.src = URL.createObjectURL(imageFile);

    // Right: editable line list
    const listEl = $('ocr-line-list');
    listEl.innerHTML = '';
    currentEdited = [...lines];

    lines.forEach((line, i) => {
      const isChord = Parser.isChordLine(line);
      const row = document.createElement('div');
      row.className = 'ocr-line-row' + (isChord ? ' ocr-chord-row' : '');
      row.dataset.index = i;

      const badge = document.createElement('span');
      badge.className = 'ocr-badge';
      badge.textContent = isChord ? 'C' : 'L';
      badge.title = isChord ? 'Chord line — click to toggle' : 'Lyric line — click to toggle';
      badge.addEventListener('click', () => {
        row.classList.toggle('ocr-chord-row');
        badge.textContent = row.classList.contains('ocr-chord-row') ? 'C' : 'L';
        // Mark as manually toggled — affects conversion
        row.dataset.manualType = row.classList.contains('ocr-chord-row') ? 'chord' : 'lyric';
      });

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'ocr-line-input';
      input.value = line;
      input.addEventListener('input', () => {
        currentEdited[i] = input.value;
        // Re-auto-detect chord/lyric unless manually set
        if (!row.dataset.manualType) {
          const nowChord = Parser.isChordLine(input.value);
          row.classList.toggle('ocr-chord-row', nowChord);
          badge.textContent = nowChord ? 'C' : 'L';
        }
      });

      row.appendChild(badge);
      row.appendChild(input);
      listEl.appendChild(row);
    });
  }

  // ── Convert corrected lines to ChordPro ───────────────────
  function linesToChordPro() {
    const listEl  = $('ocr-line-list');
    const rows    = Array.from(listEl.querySelectorAll('.ocr-line-row'));
    const lines   = rows.map((row, i) => ({
      text:    row.querySelector('.ocr-line-input').value,
      isChord: row.classList.contains('ocr-chord-row'),
    }));

    const out = [];
    let i = 0;
    while (i < lines.length) {
      const cur  = lines[i];
      const next = lines[i + 1];

      if (cur.isChord && next && !next.isChord) {
        // Merge chord line + lyric line into ChordPro inline
        out.push(mergeChordLyric(cur.text, next.text));
        i += 2;
      } else if (cur.isChord) {
        // Chord line with no following lyric — emit as chord-only line
        // Convert to [C] [Am] style
        out.push(chordLineToInline(cur.text));
        i++;
      } else {
        out.push(cur.text);
        i++;
      }
    }
    return out.join('\n');
  }

  function mergeChordLyric(chordLine, lyricLine) {
    const re     = /([A-G][#b]?(?:maj|min|m|M|sus|add|aug|dim|2|4|5|6|7|9|11|13)*(?:\/[A-G][#b]?)?)/g;
    const chords = [];
    let m;
    while ((m = re.exec(chordLine)) !== null) chords.push({ pos: m.index, chord: m[0] });
    if (!chords.length) return lyricLine;
    let result = '', last = 0;
    chords.forEach(({ pos, chord }) => {
      const lp = Math.min(pos, lyricLine.length);
      result += lyricLine.slice(last, lp) + '[' + chord + ']';
      last = lp;
    });
    return result + lyricLine.slice(last);
  }

  function chordLineToInline(chordLine) {
    return chordLine.trim().split(/\s+/)
      .filter(Boolean)
      .map(c => '[' + c + ']')
      .join(' ');
  }

  // ── Status bar ────────────────────────────────────────────
  function setStatus(msg, pct) {
    const s = $('ocr-status');
    if (!s) return;
    s.textContent = msg + (pct > 0 && pct < 100 ? ` (${pct}%)` : '');
  }

  // ── Init ──────────────────────────────────────────────────
  function init(onResultCallback) {
    onResult = onResultCallback;

    const dropEl   = $('ocr-drop');
    const inputEl  = $('ocr-file-input');
    const convertEl = $('ocr-convert');

    if (!dropEl) return;

    dropEl.addEventListener('click', () => inputEl.click());
    dropEl.addEventListener('dragover', e => { e.preventDefault(); dropEl.classList.add('drop-active'); });
    dropEl.addEventListener('dragleave', () => dropEl.classList.remove('drop-active'));
    dropEl.addEventListener('drop', async e => {
      e.preventDefault();
      dropEl.classList.remove('drop-active');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) await handleImage(file);
    });

    inputEl.addEventListener('change', async e => {
      const file = e.target.files[0];
      if (file) await handleImage(file);
      e.target.value = '';
    });

    convertEl.addEventListener('click', () => {
      const cpText = linesToChordPro();
      if (onResult) onResult(cpText);
    });
  }

  async function handleImage(file) {
    $('ocr-correction-panel').style.display = 'none';
    $('ocr-status').textContent = '';
    $('ocr-drop').style.display = 'none';
    $('ocr-status-bar').style.display = 'block';

    try {
      const lines = await recognise(file);
      renderCorrectionUI(file, lines);
      $('ocr-actions').style.display = 'flex';
    } catch(err) {
      setStatus('OCR failed: ' + err.message, 0);
    }
  }

  return { init };
})();
