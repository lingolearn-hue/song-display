// parser.js — ChordPro parser, chord-line detector, import auto-detect

const Parser = (() => {

  // ── Transpose ────────────────────────────────────────────
  const NOTES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const NOTES_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

  function transposeNote(note, semitones) {
    if (semitones === 0) return note;
    const useFlat = note.includes('b') || ['F','Bb','Eb','Ab','Db','Gb'].includes(note);
    const scale = useFlat ? NOTES_FLAT : NOTES_SHARP;
    const idx = scale.indexOf(note);
    if (idx === -1) return note;
    return scale[((idx + semitones) % 12 + 12) % 12];
  }

  function transposeChord(chord, semitones) {
    if (semitones === 0) return chord;
    return chord.replace(/^([A-G][#b]?)(.*)/, (_, root, rest) => {
      // Handle bass note after /
      const slashIdx = rest.lastIndexOf('/');
      if (slashIdx !== -1) {
        const qual = rest.slice(0, slashIdx);
        const bassMatch = rest.slice(slashIdx + 1).match(/^([A-G][#b]?)(.*)/);
        if (bassMatch) {
          return transposeNote(root, semitones) + qual + '/' +
                 transposeNote(bassMatch[1], semitones) + bassMatch[2];
        }
      }
      return transposeNote(root, semitones) + rest;
    });
  }

  // ── ChordPro inline line → { chordStr, lyricStr } ─────────
  function parseInlineLine(line, semitones) {
    const tokens = [];
    const re = /\[([^\]]+)\]/g;
    let last = 0, m;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) tokens.push({ type: 'lyric', text: line.slice(last, m.index) });
      tokens.push({ type: 'chord', text: transposeChord(m[1], semitones) });
      last = m.index + m[0].length;
    }
    if (last < line.length) tokens.push({ type: 'lyric', text: line.slice(last) });

    // Build two parallel buffers
    const chordBuf = [];
    const lyricBuf = [];
    let pos = 0;

    tokens.forEach(tok => {
      if (tok.type === 'chord') {
        while (chordBuf.length < pos) chordBuf.push(' ');
        tok.text.split('').forEach(c => chordBuf.push(c));
        pos = Math.max(pos, chordBuf.length + 1);
      } else {
        while (lyricBuf.length < pos) lyricBuf.push(' ');
        tok.text.split('').forEach(c => lyricBuf.push(c));
        pos = lyricBuf.length;
      }
    });

    return {
      chordStr: chordBuf.join('').trimEnd(),
      lyricStr: lyricBuf.join('').trimEnd(),
    };
  }

  // ── Parse full ChordPro → sections[] ────────────────────
  // Returns: [ { label: string|null, rows: [{type,text}] } ]
  // Each section is a unit that must not be split across pages.
  function parseChordPro(content, semitones = 0) {
    const lines = content.split('\n');
    const sections = [];
    let current = { label: null, rows: [] };

    const pushSection = () => {
      if (current.rows.length > 0) sections.push(current);
      current = { label: null, rows: [] };
    };

    lines.forEach(raw => {
      const line = raw.trimEnd();
      const trimmed = line.trim();

      // start_of_* directive
      const secStart = trimmed.match(/^\{start_of_(\w+)(?::\s*(.+))?\}$/i);
      if (secStart) {
        pushSection();
        const label = secStart[2] || secStart[1].replace(/_/g, ' ');
        current = { label, rows: [] };
        return;
      }

      // end_of_* directive
      if (/^\{end_of_/i.test(trimmed)) {
        pushSection();
        return;
      }

      // Other directives (title, artist, key…) — skip for display
      if (/^\{[^}]+\}$/.test(trimmed)) return;

      // Empty line between sections (not inside a directive block)
      if (!trimmed) {
        pushSection();
        return;
      }

      // Inline ChordPro: has [Chord] tokens
      if (/\[[A-G][^\]]*\]/.test(trimmed)) {
        const { chordStr, lyricStr } = parseInlineLine(trimmed, semitones);
        if (chordStr) current.rows.push({ type: 'chord', text: chordStr });
        if (lyricStr) current.rows.push({ type: 'lyric', text: lyricStr });
        return;
      }

      // Plain lyric
      current.rows.push({ type: 'lyric', text: trimmed });
    });

    pushSection();
    return sections;
  }

  // ── Tab-style chord-line detector ─────────────────────────
  // Detects lines like "C           Am    F    G"
  const CHORD_RE = /^([A-G][#b]?(maj|min|m|M|sus|add|aug|dim|[0-9]|\/[A-G])*\s*)+$/;

  function isChordLine(line) {
    const t = line.trim();
    if (!t) return false;
    if (t.length > 60) return false;
    // Must be mostly chord tokens, separated by whitespace
    const tokens = t.split(/\s+/);
    if (tokens.length === 0) return false;
    const chordLike = tokens.filter(tok => /^[A-G][#b]?/.test(tok)).length;
    return chordLike / tokens.length >= 0.75;
  }

  // Convert tab-style (chord lines above lyric lines) to ChordPro inline
  function tabStyleToChordPro(text) {
    const lines = text.split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (isChordLine(line) && i + 1 < lines.length && lines[i + 1].trim() && !isChordLine(lines[i + 1])) {
        // Merge chord line + lyric line into inline ChordPro
        const chords = line;
        const lyrics = lines[i + 1];
        out.push(mergeChordLyricLines(chords, lyrics));
        i += 2;
      } else {
        out.push(line);
        i++;
      }
    }
    return out.join('\n');
  }

  // Merge "C      Am    F" + "I heard..." into "[C]I [Am]heard... [F]..."
  function mergeChordLyricLines(chordLine, lyricLine) {
    // Find chord positions
    const chordRe = /([A-G][#b]?(?:maj|min|m|M|sus|add|aug|dim|[0-9])*(?:\/[A-G][#b]?)?)/g;
    const chords = [];
    let m;
    while ((m = chordRe.exec(chordLine)) !== null) {
      chords.push({ pos: m.index, chord: m[0] });
    }
    if (!chords.length) return lyricLine;

    // Insert [Chord] tokens into lyric at corresponding positions
    let result = '';
    let lastLyricPos = 0;
    chords.forEach(({ pos, chord }) => {
      const lyricPos = Math.min(pos, lyricLine.length);
      result += lyricLine.slice(lastLyricPos, lyricPos) + '[' + chord + ']';
      lastLyricPos = lyricPos;
    });
    result += lyricLine.slice(lastLyricPos);
    return result;
  }

  // ── Auto-detect format and normalise to ChordPro ──────────
  function detectAndNormalise(raw) {
    const text = raw.trim();

    // Already ChordPro inline?
    if (/\[[A-G][^\]]*\]/.test(text)) {
      return { format: 'chordpro', content: text };
    }

    // Tab-style: has chord lines above lyric lines?
    const lines = text.split('\n');
    const chordLineCount = lines.filter(isChordLine).length;
    if (chordLineCount >= 2) {
      const converted = tabStyleToChordPro(text);
      return { format: 'chordpro', content: converted };
    }

    // Plain text
    return { format: 'plain', content: text };
  }

  // ── Extract title/artist from raw text heuristics ─────────
  function extractMeta(raw) {
    const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
    let title = '', artist = '';

    // ChordPro directives
    for (const line of lines) {
      const t = line.match(/^\{title:\s*(.+)\}$/i);
      const a = line.match(/^\{artist:\s*(.+)\}$/i);
      const st = line.match(/^\{t:\s*(.+)\}$/i);
      const sa = line.match(/^\{st:\s*(.+)\}$/i);
      if (t)  title  = t[1].trim();
      if (a)  artist = a[1].trim();
      if (st) title  = st[1].trim();
      if (sa) artist = sa[1].trim();
    }
    if (title) return { title, artist };

    // Heuristic: first non-chord, non-directive line is title
    // second might be "by Artist" or "Artist"
    const textLines = lines.filter(l => !/^\{/.test(l) && !isChordLine(l));
    if (textLines[0]) title = textLines[0];
    if (textLines[1] && /^by\s/i.test(textLines[1])) {
      artist = textLines[1].replace(/^by\s+/i, '');
    }

    return { title: title || 'Untitled', artist: artist || '' };
  }

  return {
    transposeChord,
    parseChordPro,
    detectAndNormalise,
    extractMeta,
    isChordLine,
  };
})();
