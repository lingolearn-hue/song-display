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

      // Bracket-style section marker: [Verse 1], [Chorus], [Bridge] etc.
      // (handles content pasted directly without going through tabStyleToChordPro)
      const bracketSection = isSectionMarker(trimmed);
      if (bracketSection !== null) {
        pushSection();
        current = { label: bracketSection, lines: [] };
        return;
      }

      // Empty line → section boundary
      if (!trimmed) { pushSection(); return; }

      // Has true inline [Chord]lyric tokens? (not a bare section marker)
      if (hasInlineChordTokens(trimmed)) {
        current.lines.push(retokenise(trimmed, semitones));
      } else {
        // Plain lyric line
        current.lines.push([{ chord: null, text: trimmed }]);
      }
    });

    pushSection();
    return sections;
  }

  // ── Section marker detection ──────────────────────────────
  // Recognises common bracket-style section headers like [Verse 1], [Chorus],
  // [Bridge], [Intro], [Outro], [Pre-Chorus], etc. These are NOT chord tokens
  // even though e.g. "[Chorus]" starts with a letter in A-G — distinguished
  // by checking the bracket contents against known section words.
  const SECTION_WORDS = /^(verse|chorus|bridge|intro|outro|pre-?chorus|refrain|hook|interlude|tag|ending|coda|vamp|breakdown|instrumental)\b/i;

  function isSectionMarker(line) {
    const t = line.trim();
    const m = t.match(/^\[([^\]]+)\]$/);
    if (!m) return null;
    const inner = m[1].trim();
    if (SECTION_WORDS.test(inner)) return inner;
    return null;
  }

  // ── Is this an inline ChordPro chord token line? ──────────
  // True ChordPro lines have [Chord] immediately followed by lyric text
  // on the SAME line, e.g. "[C]Amazing [G7]grace". A bracket that is the
  // ENTIRE line content (with nothing else) is a section marker, not a chord.
  function hasInlineChordTokens(line) {
    const t = line.trim();
    if (isSectionMarker(t)) return false;
    return /\[[A-G][#b]?[^\]]*\]/.test(t);
  }

  // ── Tab-style chord-line detector ────────────────────────
  function isChordLine(line) {
    const t = line.trim();
    if (!t || t.length > 80) return false;
    const tokens = t.split(/\s+/);
    const chordLike = tokens.filter(tok => /^[A-G][#b]?(maj|min|m|M|sus|add|aug|dim|[0-9]|\/[A-G])*$/.test(tok)).length;
    return tokens.length > 0 && chordLike / tokens.length >= 0.75;
  }

  // Merge a chord-line + lyric-line pair into ChordPro inline format.
  // Chord column positions are snapped to the nearest word-start in the lyric
  // line (within a small tolerance), since real-world chord sheets are often
  // off by 1-2 characters due to copy-paste/whitespace inconsistencies, while
  // chords are conventionally intended to align with the start of a word.
  function mergeChordLyricLines(chordLine, lyricLine) {
    const chordRe = /([A-G][#b]?(?:maj|min|m|M|sus|add|aug|dim|[0-9])*(?:\/[A-G][#b]?)?)/g;
    const chords  = [];
    let m;
    while ((m = chordRe.exec(chordLine)) !== null) {
      chords.push({ pos: m.index, chord: m[0] });
    }
    if (!chords.length) return lyricLine;

    // Find word-start indices in the lyric line (start of string, or any
    // position right after whitespace)
    const wordStarts = [];
    for (let i = 0; i < lyricLine.length; i++) {
      if (i === 0 && lyricLine[i] !== ' ') wordStarts.push(0);
      else if (lyricLine[i] !== ' ' && lyricLine[i-1] === ' ') wordStarts.push(i);
    }

    const TOLERANCE = 3; // max chars to snap a chord position to a word start

    // Greedily assign each chord to its nearest AVAILABLE word start
    // (closest chord-position/word-start pairs win first), so two close
    // chords never collapse onto the same word.
    const availableStarts = [...wordStarts];
    const candidates = [];
    chords.forEach((c, ci) => {
      availableStarts.forEach(ws => {
        const d = Math.abs(ws - c.pos);
        if (d <= TOLERANCE) candidates.push({ ci, ws, d });
      });
    });
    candidates.sort((a, b) => a.d - b.d);

    const chordToWordStart = new Map(); // chord index -> assigned word start
    const usedStarts = new Set();
    for (const { ci, ws } of candidates) {
      if (chordToWordStart.has(ci) || usedStarts.has(ws)) continue;
      chordToWordStart.set(ci, ws);
      usedStarts.add(ws);
    }

    const snapped = chords.map((c, ci) => {
      const finalPos = chordToWordStart.has(ci) ? chordToWordStart.get(ci) : c.pos;
      return { pos: Math.min(finalPos, lyricLine.length), chord: c.chord };
    });

    // Ensure positions remain in ascending order (stable sort preserves
    // original chord order for any ties)
    snapped.sort((a, b) => a.pos - b.pos);

    let result = '', lastPos = 0;
    snapped.forEach(({ pos, chord }) => {
      const lyricPos = Math.max(pos, lastPos); // never go backwards
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
      const line = lines[i];
      const sectionName = isSectionMarker(line);

      if (sectionName !== null) {
        // Convert [Verse 1] / [Chorus] → {start_of_verse: Verse 1} etc.
        const lower = sectionName.toLowerCase();
        const kind = lower.startsWith('chorus')      ? 'chorus'
                   : lower.startsWith('bridge')       ? 'bridge'
                   : lower.startsWith('pre-chorus') || lower.startsWith('prechorus') ? 'verse'
                   : 'verse';
        out.push(`{start_of_${kind}: ${sectionName}}`);
        i++;
        continue;
      }

      const nextLine = lines[i+1];
      const nextIsDirective = nextLine !== undefined && /^\s*\{[^}]+\}\s*$/.test(nextLine);

      if (isChordLine(line) && i + 1 < lines.length && nextLine.trim()
          && !isChordLine(nextLine) && isSectionMarker(nextLine) === null
          && !nextIsDirective) {
        out.push(mergeChordLyricLines(line, nextLine));
        i += 2;
      } else {
        out.push(line);
        i++;
      }
    }
    return out.join('\n');
  }

  // ── Auto-detect format ────────────────────────────────────
  function detectAndNormalise(raw) {
    const text = raw.trim();
    const lines = text.split('\n');

    // True inline ChordPro: at least one line has [Chord]lyric on the same line
    if (lines.some(hasInlineChordTokens)) {
      return { format: 'chordpro', content: text };
    }

    // Tab-style: chord-only lines (ignoring section marker lines) ≥ 2
    const chordLineCount = lines.filter(l => isSectionMarker(l) === null && isChordLine(l)).length;
    if (chordLineCount >= 2) {
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
    const textLines = lines.filter(l => !/^\{/.test(l) && !isChordLine(l) && isSectionMarker(l) === null);
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
    isSectionMarker,
    hasInlineChordTokens,
  };
})();
