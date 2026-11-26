/* Wolver-Fik Suite — lenguaje, filtros, búsqueda y registro del service worker. */
(function (global) {
  'use strict';

  var LANGS = ['en', 'es', 'pt', 'fr', 'it', 'de', 'ru', 'ja'];
  var DEFAULT_LANG = 'en';
  var STORAGE_KEY = 'wf-suite-lang';
  var I18N = {};
  var APPS = [];
  var CATEGORIES = ['all'];
  var IN_USE = {};

  var state = { lang: DEFAULT_LANG, category: 'all', query: '' };
  var els = {};

  // Los datos se leen al inicializar, no al evaluar este archivo. Si el service
  // worker sirve los scripts en otro orden, el catálogo y los filtros siguen
  // construyéndose con los globals ya disponibles en ese momento.
  function refreshData() {
    I18N = global.WF_I18N || {};
    APPS = Array.isArray(global.WF_APPS) ? global.WF_APPS : [];
    CATEGORIES = Array.isArray(global.WF_CATEGORIES) && global.WF_CATEGORIES.length
      ? global.WF_CATEGORIES
      : ['all'];
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  /* Detección de uso real. Solo comprobamos la existencia de las claves de
   * datos y de las cachés PWA bajo este mismo origen. El contenido de los
   * registros nunca se interpreta ni se escribe nada en las apps. */
  function hasMeaningfulValue(raw) {
    return !!raw && raw !== 'null' && raw !== '[]' && raw !== '{}';
  }

  function detectStoredUsage() {
    var found = {};

    APPS.forEach(function (app) {
      found[app.id] = false;
      var keys = Array.isArray(app.storageKeys) ? app.storageKeys : [];
      for (var i = 0; i < keys.length; i += 1) {
        try {
          if (hasMeaningfulValue(global.localStorage.getItem(keys[i]))) {
            found[app.id] = true;
            break;
          }
        } catch (err) { /* almacenamiento bloqueado */ }
      }
    });

    return found;
  }

  function detectCachedUsage(found, done) {
    if (!global.caches || typeof global.caches.keys !== 'function') {
      done();
      return;
    }

    global.caches.keys().then(function (keys) {
      APPS.forEach(function (app) {
        if (found[app.id]) return;
        var prefixes = Array.isArray(app.cachePrefixes) ? app.cachePrefixes : [];
        found[app.id] = keys.some(function (name) {
          return prefixes.some(function (prefix) { return name.indexOf(prefix) === 0; });
        });
      });
      done();
    }).catch(function () { done(); });
  }

  function readStoredLang() {
    try { return global.localStorage.getItem(STORAGE_KEY); } catch (err) { return null; }
  }

  function storeLang(lang) {
    try { global.localStorage.setItem(STORAGE_KEY, lang); } catch (err) { /* modo privado */ }
  }

  function detectLang() {
    var stored = readStoredLang();
    if (LANGS.indexOf(stored) !== -1) return stored;

    var candidates = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || ''];

    for (var i = 0; i < candidates.length; i += 1) {
      var base = String(candidates[i]).toLowerCase().split('-')[0];
      if (LANGS.indexOf(base) !== -1) return base;
    }
    return DEFAULT_LANG;
  }

  function t(key, vars) {
    var dict = I18N[state.lang] || {};
    var fallback = I18N[DEFAULT_LANG] || {};
    var value = Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : fallback[key];
    if (value === undefined) value = key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        value = String(value).split('{' + name + '}').join(String(vars[name]));
      });
    }
    return value;
  }

  function applyTranslations() {
    document.documentElement.lang = state.lang;
    document.documentElement.setAttribute('data-lang', state.lang);
    document.title = t('meta.title');

    var textNodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textNodes.length; i += 1) {
      textNodes[i].textContent = t(textNodes[i].getAttribute('data-i18n'));
    }

    var placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < placeholders.length; j += 1) {
      placeholders[j].setAttribute('placeholder', t(placeholders[j].getAttribute('data-i18n-placeholder')));
    }

    var ariaNodes = document.querySelectorAll('[data-i18n-aria]');
    for (var k = 0; k < ariaNodes.length; k += 1) {
      ariaNodes[k].setAttribute('aria-label', t(ariaNodes[k].getAttribute('data-i18n-aria')));
    }

    if (els.langSelect) els.langSelect.value = state.lang;
  }

  function buildFilters() {
    els.filters.innerHTML = CATEGORIES.map(function (key) {
      var active = key === state.category;
      var extraClass = key === 'inUse' ? ' chip-use' : '';
      return '<button type="button" class="chip' + extraClass + (active ? ' is-active' : '') + '"' +
        ' data-category="' + escapeHTML(key) + '" aria-pressed="' + active + '"' +
        ' data-i18n="filter.' + escapeHTML(key) + '">' + escapeHTML(t('filter.' + key)) + '</button>';
    }).join('');
  }

  function cardHTML(app) {
    var desc = t('apps.' + app.id + '.desc');
    var tags = app.tags.map(function (key) {
      return '<li>' + escapeHTML(t(key)) + '</li>';
    }).join('');
    var status = t('status.' + app.status);
    var badges = '<span class="version-badge">' +
      escapeHTML(app.version) + ' · ' + escapeHTML(status) + '</span>';

    if (IN_USE[app.id]) {
      badges += '<span class="in-use-badge">' +
        '<span class="use-dot" aria-hidden="true"></span>' + escapeHTML(t('card.inUse')) +
        '</span>';
    }

    return '<article class="app-card" style="--accent:' + escapeHTML(app.accent) + '">' +
      '<div class="card-top">' +
        '<span class="icon-tile">' + app.icon + '</span>' +
        '<span class="category-pill">' + escapeHTML(t('filter.' + app.category)) + '</span>' +
      '</div>' +
      '<div class="status-row">' + badges + '</div>' +
      '<h3>' + escapeHTML(app.name) + '</h3>' +
      '<p class="app-desc">' + escapeHTML(desc) + '</p>' +
      '<p class="independent-note">' +
        '<span class="independent-dot" aria-hidden="true"></span>' +
        escapeHTML(t('card.independent')) +
      '</p>' +
      '<ul class="tag-list">' + tags + '</ul>' +
      '<div class="card-actions">' +
        '<a class="card-link link-open" href="' + escapeHTML(app.url) + '" target="_blank" rel="noopener noreferrer">' +
          '<span>' + escapeHTML(t('card.open')) + '</span>' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"></path></svg>' +
        '</a>' +
        '<a class="card-link link-source" href="' + escapeHTML(app.source) + '" target="_blank" rel="noopener noreferrer">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.76.12 3.05.73.81 1.17 1.83 1.17 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"></path></svg>' +
          '<span>' + escapeHTML(t('card.source')) + '</span>' +
        '</a>' +
      '</div>' +
    '</article>';
  }

  function comingSoonHTML() {
    return '<article class="app-card coming-soon">' +
      '<span class="soon-badge">' + escapeHTML(t('soon.badge')) + '</span>' +
      '<div class="soon-glyph" aria-hidden="true">WF</div>' +
      '<h3>' + escapeHTML(t('soon.title')) + '</h3>' +
      '<p class="app-desc">' + escapeHTML(t('soon.text')) + '</p>' +
      '<span class="soon-line" aria-hidden="true"></span>' +
    '</article>';
  }

  function render() {
    if (!APPS.length) refreshData();
    var query = normalize(state.query);

    var visible = APPS.filter(function (app) {
      if (state.category === 'inUse') {
        if (!IN_USE[app.id]) return false;
      } else if (state.category !== 'all' && app.category !== state.category) {
        return false;
      }
      if (!query) return true;

      var haystack = [
        app.name,
        t('filter.' + app.category),
        t('apps.' + app.id + '.desc'),
        app.tags.map(function (key) { return t(key); }).join(' ')
      ].join(' ');

      return normalize(haystack).indexOf(query) !== -1;
    });

    var html = visible.map(cardHTML).join('');
    if (visible.length || (!query && state.category === 'all')) html += comingSoonHTML();

    els.grid.innerHTML = html;
    els.empty.hidden = visible.length !== 0;
    els.count.textContent = t('catalog.results', { count: visible.length });
    els.clear.hidden = !state.query;
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) return;
    state.lang = lang;
    storeLang(lang);
    refreshData();
    applyTranslations();
    buildFilters();
    render();
  }

  function openGuide() {
    if (!els.guideDialog) return;
    if (typeof els.guideDialog.showModal === 'function') {
      els.guideDialog.showModal();
    } else {
      els.guideDialog.setAttribute('open', '');
    }
  }

  function closeGuide() {
    if (!els.guideDialog) return;
    if (typeof els.guideDialog.close === 'function') {
      els.guideDialog.close();
    } else {
      els.guideDialog.removeAttribute('open');
    }
  }

  function refreshUsage() {
    IN_USE = detectStoredUsage();
    detectCachedUsage(IN_USE, render);
  }

  function init() {
    els.langSelect = document.getElementById('langSelect');
    els.search = document.getElementById('searchInput');
    els.clear = document.getElementById('clearSearch');
    els.filters = document.getElementById('filters');
    els.grid = document.getElementById('appGrid');
    els.empty = document.getElementById('emptyState');
    els.count = document.getElementById('resultCount');
    els.guideTrigger = document.getElementById('guideTrigger');
    els.guideDialog = document.getElementById('guideDialog');
    els.guideClose = document.getElementById('guideClose');
    els.guideDone = document.getElementById('guideDone');

    if (!els.langSelect || !els.search || !els.clear || !els.filters || !els.grid || !els.empty || !els.count) return;

    refreshData();
    state.lang = detectLang();
    IN_USE = detectStoredUsage();

    els.langSelect.addEventListener('change', function (event) {
      setLang(event.target.value);
    });

    els.search.addEventListener('input', function (event) {
      state.query = event.target.value;
      render();
    });

    els.clear.addEventListener('click', function () {
      state.query = '';
      els.search.value = '';
      els.search.focus();
      render();
    });

    els.filters.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-category]');
      if (!button) return;
      state.category = button.getAttribute('data-category');

      var chips = els.filters.querySelectorAll('button[data-category]');
      for (var i = 0; i < chips.length; i += 1) {
        var active = chips[i] === button;
        chips[i].classList.toggle('is-active', active);
        chips[i].setAttribute('aria-pressed', String(active));
      }
      render();
    });

    if (els.guideTrigger) els.guideTrigger.addEventListener('click', openGuide);
    if (els.guideClose) els.guideClose.addEventListener('click', closeGuide);
    if (els.guideDone) els.guideDone.addEventListener('click', closeGuide);
    if (els.guideDialog) {
      els.guideDialog.addEventListener('click', function (event) {
        if (event.target === els.guideDialog) closeGuide();
      });
    }

    applyTranslations();
    buildFilters();
    render();
    detectCachedUsage(IN_USE, render);

    // Al volver desde una app (bfcache) las cachés pueden haber cambiado.
    global.addEventListener('pageshow', function (event) {
      if (event.persisted) refreshUsage();
    });

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      global.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').catch(function () { /* offline sin SW */ });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
