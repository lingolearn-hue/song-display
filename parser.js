// parser.js v0.4 — ChordPro parser, ruby-style chord tokens, import auto-detect

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

  // ── Parse one ChordPro inline line into chord-lyric tokens ─
  // Returns an array of tokens:
  //   { chord: 'Am'|null, text: 'lyric text' }
  // A chord token sits above the start of its text.
  // Text with no preceding chord has chord: null.
  function parseInlineTokens(line, semitones) {
    const tokens = [];
    const re = /\[([^\]]+)\]/g;
    let last = 0, m;

    while ((m = re.exec(line)) !== null) {
      // Text before this chord (no chord above it, unless it follows immediately)
      if (m.index > last) {
        const txt = line.slice(last, m.index);
        // Attach to previous token's text if previous had a chord, else standalone
        tokens.push({ chord: null, text: txt });
      }
      // Chord: its anchor text is everything up to the next chord marker
      const chordName = transposeChord(m[1], semitones);
      // We'll fill text in the next iteration or at end
      tokens.push({ chord: chordName, text: '' });
      last = m.index + m[0].length;
    }
    // Remaining text after last chord
    if (last < line.length) {
      const txt = line.slice(last);
      if (tokens.length > 0 && tokens[tokens.length - 1].chord !== null && tokens[tokens.length - 1].text === '') {
        tokens[tokens.length - 1].text = txt;
      } else {
        tokens.push({ chord: null, text: txt });
      }
    }

    // Assign remaining text: each chord token gets the text up to the next chord
    // Re-parse more carefully: split on [Chord] boundaries
    return retokenise(line, semitones);
  }

  // Cleaner tokeniser: each [Chord]text_until_next_chord becomes one token
  function retokenise(line, semitones) {
    const tokens = [];
    const re = /\[([^\]]+)\]/g;
    let last = 0, m;
    let pendingChord = null;

    while ((m = re.exec(line)) !== null) {
      const textBefore = line.slice(last, m.index);
      if (pendingChord !== null) {
        // Text belongs to the pending chord
        tokens.push({ chord: pendingChord, text: textBefore });
        pendingChord = null;
      } else if (textBefore) {
        tokens.push({ chord: null, text: textBefore });
      }
      pendingChord = transposeChord(m[1], semitones);
      last = m.index + m[0].length;
    }
    // Remaining text
    const textAfter = line.slice(last);
    if (pendingChord !== null) {
      tokens.push({ chord: pendingChord, text: textAfter });
    } else if (textAfter) {
      tokens.push({ chord: null, text: textAfter });
    }
    return tokens;
  }

  // ── Parse full ChordPro → sections[] ────────────────────
  // Each section = { label: string|null, lines: [ tokens[] ] }
  // Each line is an array of tokens { chord, text }
  // A line with no chords is [ { chord: null, text: 'full line' } ]
  function parseChordPro(content, semitones = 0) {
    const lines    = content.split('\n');
    const sections = [];
    let current    = { label: null, lines: [] };

    const pushSection = () => {
      // Trim trailing empty lines
      while (current.lines.length && current.lines[current.lines.length-1].every(t => !t.text.trim() && !t.chord)) {
        current.lines.pop();
      }
      if (current.lines.length > 0 || current.label) sections.push(current);
      current = { label: null, lines: [] };
    };

    lines.forEach(raw => {
      const trimmed = raw.trim();

      // start_of_* directive
      const secStart = trimmed.match(/^\{start_of_(\w+)(?::\s*(.+))?\}$/i);
      if (secStart) {
        pushSection();
        current = { label: secStart[2] || secStart[1].replace(/_/g, ' '), lines: [] };
        return;
      }
      if (/^\{end_of_/i.test(trimmed)) { pushSection(); return; }

      // Metadata directives — skip display
      if (/^\{(title|t|artist|st|key|capo|bpm|tempo)[:\s]/i.test(trimmed) && trimmed.endsWith('}')) return;
      // Other directives — skip
      if (/^\{[^}]+\}$/.test(trimmed)) return;

      // Empty line → section boundary
      if (!trimmed) { pushSection(); return; }

      // Has inline [Chord] tokens?
      if (/\[[A-G][^\]]*\]/.test(trimmed)) {
        current.lines.push(retokenise(trimmed, semitones));
      } else {
        // Plain lyric line
        current.lines.push([{ chord: null, text: trimmed }]);
      }
    });

    pushSection();
    return sections;
  }

  // ── Tab-style chord-line detector ────────────────────────
  function isChordLine(line) {
    const t = line.trim();
    if (!t || t.length > 80) return false;
    const tokens = t.split(/\s+/);
    const chordLike = tokens.filter(tok => /^[A-G][#b]?(maj|min|m|M|sus|add|aug|dim|[0-9]|\/[A-G])*$/.test(tok)).length;
    return tokens.length > 0 && chordLike / tokens.length >= 0.75;
  }

  function mergeChordLyricLines(chordLine, lyricLine) {
    const chordRe = /([A-G][#b]?(?:maj|min|m|M|sus|add|aug|dim|[0-9])*(?:\/[A-G][#b]?)?)/g;
    const chords  = [];
    let m;
    while ((m = chordRe.exec(chordLine)) !== null) {
      chords.push({ pos: m.index, chord: m[0] });
    }
    if (!chords.length) return lyricLine;
    let result = '', lastPos = 0;
    chords.forEach(({ pos, chord }) => {
      const lyricPos = Math.min(pos, lyricLine.length);
      result += lyricLine.slice(lastPos, lyricPos) + '[' + chord + ']';
      lastPos = lyricPos;
    });
    result += lyricLine.slice(lastPos);
    return result;
  }

  function tabStyleToChordPro(text) {
    const lines = text.split('\n');
    const out   = [];
    let i = 0;
    while (i < lines.length) {
      if (isChordLine(lines[i]) && i + 1 < lines.length && lines[i+1].trim() && !isChordLine(lines[i+1])) {
        out.push(mergeChordLyricLines(lines[i], lines[i+1]));
        i += 2;
      } else {
        out.push(lines[i]);
        i++;
      }
    }
    return out.join('\n');
  }

  // ── Auto-detect format ────────────────────────────────────
  function detectAndNormalise(raw) {
    const text = raw.trim();
    if (/\[[A-G][^\]]*\]/.test(text)) return { format: 'chordpro', content: text };
    const lines = text.split('\n');
    if (lines.filter(isChordLine).length >= 2) {
      return { format: 'chordpro', content: tabStyleToChordPro(text) };
    }
    return { format: 'plain', content: text };
  }

  // ── Extract metadata heuristics ───────────────────────────
  function extractMeta(raw) {
    const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
    let title = '', artist = '';
    for (const line of lines) {
      const t  = line.match(/^\{(?:title|t):\s*(.+)\}$/i);
      const a  = line.match(/^\{(?:artist|st):\s*(.+)\}$/i);
      if (t) title  = t[1].trim();
      if (a) artist = a[1].trim();
    }
    if (title) return { title, artist };
    const textLines = lines.filter(l => !/^\{/.test(l) && !isChordLine(l));
    if (textLines[0]) title = textLines[0].replace(/\[[^\]]*\]/g, '').trim();
    if (textLines[1] && /^by\s/i.test(textLines[1])) artist = textLines[1].replace(/^by\s+/i, '');
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
