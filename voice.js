// voice.js v0.5 — voice-driven page turner using Web Speech API
// Strategy: flatten song lyrics into a word sequence with page markers.
// As speech results arrive, fuzzy-match against a sliding window ahead
// of the current position. When enough words match, advance the page.

const Voice = (() => {

  let recognition   = null;
  let active        = false;
  let wordList      = [];   // [{word, page}] — all lyric words with their page index
  let cursor        = 0;   // current position in wordList
  let onPageChange  = null; // callback(pageIndex)
  let onStatus      = null; // callback(statusText)
  let currentPage   = 0;

  // ── Build word list from pages ────────────────────────────
  // pages: array of sections[] (as produced by Parser + pagination)
  function buildWordList(pages) {
    wordList = [];
    cursor   = 0;
    pages.forEach((sections, pageIdx) => {
      sections.forEach(sec => {
        sec.lines.forEach(tokens => {
          tokens.forEach(tok => {
            if (tok.text) {
              tok.text.split(/\s+/).forEach(raw => {
                const w = normalise(raw);
                if (w.length > 1) wordList.push({ word: w, page: pageIdx });
              });
            }
          });
        });
      });
    });
  }

  // ── Normalise a word for fuzzy matching ───────────────────
  function normalise(w) {
    return w.toLowerCase()
      .replace(/[^a-z0-9àáâãäåæçèéêëìíîïðñòóôõöùúûüýþÿ]/g, '')
      .replace(/['']/g, '');
  }

  // ── Skip common filler words that speech recognition often drops ──
  const SKIP = new Set([
    'a','an','the','and','or','but','in','on','at','to','of','for',
    'is','it','i','my','me','you','your','we','our','he','she','they',
    'so','oh','ah','hey','yeah','la','da','na','ya',
  ]);

  function isSignificant(w) {
    return w.length > 1 && !SKIP.has(w);
  }

  // ── Match incoming transcript against word list ───────────
  // Returns the furthest page index matched, or -1 if no match.
  function matchTranscript(transcript) {
    const words = transcript.split(/\s+/)
      .map(normalise)
      .filter(w => w.length > 1);

    if (!words.length) return -1;

    // Look for a run of matches starting from cursor,
    // scanning up to LOOKAHEAD words ahead.
    const LOOKAHEAD  = 60;  // words ahead of cursor to search
    const MATCH_NEED = 2;   // significant words needed to trigger advance
    const end = Math.min(cursor + LOOKAHEAD, wordList.length);

    let bestPage = -1;
    let matchCount = 0;
    let searchPos = cursor;

    // Slide through wordList looking for words from the transcript
    for (let i = cursor; i < end; i++) {
      const wl = wordList[i];
      if (words.includes(wl.word)) {
        if (isSignificant(wl.word)) matchCount++;
        searchPos = i;
        if (wl.page > currentPage) bestPage = wl.page;
        if (matchCount >= MATCH_NEED) {
          cursor = searchPos;
          return bestPage;
        }
      }
    }

    // Partial match — advance cursor slightly to keep up
    if (matchCount >= 1) cursor = Math.min(cursor + 3, wordList.length - 1);
    return -1;
  }

  // ── Start recognition ─────────────────────────────────────
  function start(pages, pageIdx, callbacks) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      if (callbacks.onStatus) callbacks.onStatus('Voice not supported in this browser');
      return false;
    }

    onPageChange = callbacks.onPageChange;
    onStatus     = callbacks.onStatus;
    currentPage  = pageIdx;
    buildWordList(pages);

    // Advance cursor to current page start
    const firstInPage = wordList.findIndex(w => w.page >= pageIdx);
    if (firstInPage !== -1) cursor = firstInPage;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = 'en-US';  // overridable
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      active = true;
      if (onStatus) onStatus('🎤 Listening…');
    };

    recognition.onresult = (e) => {
      // Collect all results (interim + final) from this event batch
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        // Use top alternative
        transcript += ' ' + e.results[i][0].transcript;
        // Also try other alternatives for robustness
        for (let j = 1; j < e.results[i].length; j++) {
          transcript += ' ' + e.results[i][j].transcript;
        }
      }

      const advanceTo = matchTranscript(transcript.trim());
      if (advanceTo !== -1 && advanceTo > currentPage) {
        currentPage = advanceTo;
        if (onPageChange) onPageChange(advanceTo);
        if (onStatus) onStatus('🎤 Listening… (page ' + (advanceTo + 1) + ')');
      }
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') return; // normal, just keep going
      if (e.error === 'aborted')   return;
      if (onStatus) onStatus('Voice error: ' + e.error);
    };

    recognition.onend = () => {
      // Auto-restart unless we stopped deliberately
      if (active) {
        try { recognition.start(); } catch(_) {}
      }
    };

    try {
      recognition.start();
      return true;
    } catch(e) {
      if (onStatus) onStatus('Could not start voice recognition');
      return false;
    }
  }

  function stop() {
    active = false;
    if (recognition) {
      try { recognition.stop(); } catch(_) {}
      recognition = null;
    }
  }

  // Call when page changes externally (tap) to keep cursor in sync
  function syncPage(pageIdx) {
    currentPage = pageIdx;
    const firstInPage = wordList.findIndex(w => w.page >= pageIdx);
    if (firstInPage !== -1) cursor = firstInPage;
  }

  // Set recognition language (for non-English songs)
  function setLang(lang) {
    if (recognition) recognition.lang = lang;
  }

  function isActive() { return active; }

  return { start, stop, syncPage, setLang, isActive };
})();
