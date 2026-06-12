// fetcher.js — URL import: CORS proxy fetch + per-site parsers

const Fetcher = (() => {

  // Configurable proxy — default allorigins, overridable in settings
  let proxyUrl = 'https://api.allorigins.win/get?url=';

  function setProxy(url) { proxyUrl = url; }

  // ── Fetch raw HTML via proxy ──────────────────────────────
  async function fetchHtml(url) {
    const encoded  = encodeURIComponent(url);
    const endpoint = proxyUrl + encoded;
    const res  = await fetch(endpoint, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
    const json = await res.json();
    // allorigins wraps in { contents: "..." }
    const html = json.contents || json;
    if (!html || typeof html !== 'string') throw new Error('Empty response from proxy');
    return html;
  }

  // ── Site detection ────────────────────────────────────────
  function detectSite(url) {
    if (/ultimate-guitar\.com/i.test(url))  return 'ug';
    if (/chordie\.com/i.test(url))          return 'chordie';
    if (/e-chords\.com/i.test(url))         return 'echords';
    return 'generic';
  }

  // ── HTML → plain text (strip tags) ───────────────────────
  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText || div.textContent || '';
  }

  // ── Parse a DOM from HTML string ─────────────────────────
  function parseHtml(html) {
    return new DOMParser().parseFromString(html, 'text/html');
  }

  // ── Ultimate Guitar ───────────────────────────────────────
  // UG embeds song data as JSON in a <div class="js-store"> data attribute
  function parseUG(html) {
    const doc  = parseHtml(html);

    // Try JSON store first (most reliable)
    const store = doc.querySelector('.js-store');
    if (store) {
      try {
        const data = JSON.parse(store.getAttribute('data-content'));
        const tab  = data?.store?.page?.data?.tab;
        const tabView = data?.store?.page?.data?.tab_view;
        if (tab && tabView) {
          const content = tabView.wiki_tab?.content || tabView.applicature || '';
          return {
            title:   tab.song_name  || '',
            artist:  tab.artist_name || '',
            content: ugTabToChordPro(content),
          };
        }
      } catch (_) { /* fall through to DOM scrape */ }
    }

    // DOM fallback: look for pre.chord-sheet or div[data-content]
    const pre = doc.querySelector('pre.chord-sheet, [class*="chord-sheet"], [class*="chords"]');
    if (pre) {
      return {
        title:   doc.querySelector('h1')?.textContent?.trim() || '',
        artist:  doc.querySelector('h2')?.textContent?.trim() || '',
        content: pre.innerText || pre.textContent || '',
      };
    }

    throw new Error('Could not extract song from Ultimate Guitar page. The page may require a browser extension.');
  }

  // UG uses [ch]Chord[/ch] and [tab]...[/tab] markup
  function ugTabToChordPro(raw) {
    // Remove [tab] / [/tab] wrappers
    let text = raw.replace(/\[tab\]/gi, '').replace(/\[\/tab\]/gi, '');
    // Convert [ch]Am[/ch] → [Am]
    text = text.replace(/\[ch\]([^\[]+?)\[\/ch\]/gi, '[$1]');
    return text.trim();
  }

  // ── Chordie ───────────────────────────────────────────────
  function parseChordie(html) {
    const doc = parseHtml(html);
    const pre = doc.querySelector('#main_lyrics, .song, pre');
    if (!pre) throw new Error('Could not extract song from Chordie page.');
    // Chordie uses <b> tags for chords
    // Convert <b>Am</b> → [Am]
    let inner = pre.innerHTML;
    inner = inner.replace(/<b>([^<]+)<\/b>/gi, '[$1]');
    const div = document.createElement('div');
    div.innerHTML = inner;
    const content = (div.innerText || div.textContent || '').trim();
    return {
      title:   doc.querySelector('h1, h2')?.textContent?.trim() || '',
      artist:  '',
      content,
    };
  }

  // ── E-Chords ──────────────────────────────────────────────
  function parseEchords(html) {
    const doc = parseHtml(html);
    const pre = doc.querySelector('pre#core, pre.song, pre');
    if (!pre) throw new Error('Could not extract song from E-Chords page.');
    const content = (pre.innerText || pre.textContent || '').trim();
    const h1      = doc.querySelector('h1');
    const parts   = h1?.textContent?.split(' - ') || [];
    return {
      title:   parts[0]?.trim() || '',
      artist:  parts[1]?.trim() || '',
      content,
    };
  }

  // ── Generic fallback ──────────────────────────────────────
  function parseGeneric(html) {
    const doc = parseHtml(html);
    // Try any <pre> with chord-like content
    const pres = Array.from(doc.querySelectorAll('pre'));
    const best = pres.sort((a, b) =>
      (b.textContent?.length || 0) - (a.textContent?.length || 0)
    )[0];
    if (best) {
      return {
        title:   doc.querySelector('h1')?.textContent?.trim() || '',
        artist:  '',
        content: (best.innerText || best.textContent || '').trim(),
      };
    }
    throw new Error('Could not find song content on this page.');
  }

  // ── Main entry point ──────────────────────────────────────
  async function importFromUrl(url) {
    const html = await fetchHtml(url);
    const site = detectSite(url);

    let result;
    switch (site) {
      case 'ug':      result = parseUG(html);       break;
      case 'chordie': result = parseChordie(html);  break;
      case 'echords': result = parseEchords(html);  break;
      default:        result = parseGeneric(html);  break;
    }

    // Normalise content through the standard parser pipeline
    const { format, content } = Parser.detectAndNormalise(result.content);
    return {
      title:   result.title,
      artist:  result.artist,
      format,
      content,
      site,
    };
  }

  return { importFromUrl, setProxy };
})();
