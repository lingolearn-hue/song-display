// editor.js — song edit panel (slide-in overlay)

const Editor = (() => {

  let currentSong  = null;
  let onSaveCallback = null;
  let activeTab    = 0;   // which text is being edited

  const $ = id => document.getElementById(id);

  // ── Open ──────────────────────────────────────────────────
  function open(song, onSave) {
    currentSong    = JSON.parse(JSON.stringify(song)); // deep copy
    onSaveCallback = onSave;
    activeTab      = 0;
    populate();
    $('editor-panel').classList.add('open');
    document.body.classList.add('editor-open');
  }

  function close() {
    $('editor-panel').classList.remove('open');
    document.body.classList.remove('editor-open');
    currentSong = null;
  }

  // ── Populate fields ───────────────────────────────────────
  function populate() {
    $('edit-title').value  = currentSong.title  || '';
    $('edit-artist').value = currentSong.artist || '';
    $('edit-key').value    = currentSong.key    || '';
    $('edit-capo').value   = currentSong.capo   != null ? currentSong.capo : 0;
    $('edit-bpm').value    = currentSong.bpm    || '';
    buildTextTabs();
  }

  // ── Text tabs inside editor ───────────────────────────────
  function buildTextTabs() {
    const tabBar = $('edit-text-tabs');
    tabBar.innerHTML = '';

    currentSong.texts.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.className = 'edit-tab-btn' + (i === activeTab ? ' active' : '');
      btn.textContent = text.label || ('Text ' + (i + 1));
      btn.addEventListener('click', () => {
        saveCurrentTextContent();
        activeTab = i;
        buildTextTabs();
        loadTextContent();
      });
      tabBar.appendChild(btn);
    });

    // Add text button
    const addBtn = document.createElement('button');
    addBtn.className = 'edit-tab-btn add-tab';
    addBtn.textContent = '+ Add text';
    addBtn.addEventListener('click', addText);
    tabBar.appendChild(addBtn);

    loadTextContent();
  }

  function loadTextContent() {
    const text = currentSong.texts[activeTab];
    if (!text) return;
    $('edit-text-label').value   = text.label    || '';
    $('edit-text-content').value = text.content  || '';
    $('edit-text-format').value  = text.format   || 'chordpro';
    $('edit-text-lang').value    = text.language || '';
  }

  function saveCurrentTextContent() {
    const text = currentSong.texts[activeTab];
    if (!text) return;
    text.label    = $('edit-text-label').value.trim();
    text.content  = $('edit-text-content').value;
    text.format   = $('edit-text-format').value;
    text.language = $('edit-text-lang').value.trim() || null;
  }

  function addText() {
    saveCurrentTextContent();
    currentSong.texts.push({
      id:       uuid(),
      label:    'New text',
      format:   'chordpro',
      content:  '',
      language: null,
    });
    activeTab = currentSong.texts.length - 1;
    buildTextTabs();
  }

  function deleteCurrentText() {
    if (currentSong.texts.length <= 1) {
      alert('A song must have at least one text.');
      return;
    }
    if (!confirm(`Delete "${currentSong.texts[activeTab].label || 'this text'}"?`)) return;
    currentSong.texts.splice(activeTab, 1);
    activeTab = Math.max(0, activeTab - 1);
    buildTextTabs();
  }

  // ── Save ──────────────────────────────────────────────────
  async function save() {
    // Collect meta fields
    currentSong.title  = $('edit-title').value.trim()  || 'Untitled';
    currentSong.artist = $('edit-artist').value.trim();
    currentSong.key    = $('edit-key').value.trim();
    currentSong.capo   = parseInt($('edit-capo').value)  || 0;
    currentSong.bpm    = parseFloat($('edit-bpm').value) || null;

    // Save current text tab content
    saveCurrentTextContent();

    // Persist
    await DB.putSong(currentSong);
    close();
    if (onSaveCallback) onSaveCallback(currentSong);
  }

  // ── Delete song ───────────────────────────────────────────
  async function deleteSong() {
    if (!confirm(`Delete "${currentSong.title}"? This cannot be undone.`)) return;
    await DB.deleteSong(currentSong.id);
    close();
    if (onSaveCallback) onSaveCallback(null); // null = deleted
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    $('editor-close').addEventListener('click', close);
    $('editor-save').addEventListener('click',  save);
    $('editor-delete').addEventListener('click', deleteSong);
    $('edit-delete-text').addEventListener('click', deleteCurrentText);

    // Close on backdrop click
    $('editor-backdrop').addEventListener('click', close);

    // Prevent panel clicks from closing
    $('editor-panel').addEventListener('click', e => e.stopPropagation());
  }

  return { init, open, close };
})();
