/* Wolver-Fik Suite (Portal Hub) — botón "Instalar app" exclusivo de iOS navegador.
   La visibilidad se calcula en cada carga (y al volver al documento): no se guarda
   ninguna bandera en localStorage/IndexedDB, así que el botón reaparece si se
   desinstala la PWA y se vuelve a abrir en Safari. */
(function () {
  'use strict';

  var CFG = {
    host: '.header-actions',
    langSelect: '#langSelect',
    fallback: 'en',
    lookup: function (key, lang) {
      var d = (window.WF_I18N || {})[lang] || {};
      return typeof d[key] === 'string' ? d[key] : null;
    }
  };

  var DEFAULTS = {
    'install.button': 'Install app',
    'install.guideTitle': 'Install on iPhone or iPad',
    'install.step1': 'Tap the Share icon in Safari’s toolbar',
    'install.step2': 'Choose “Add to Home Screen”',
    'install.close': 'Close',
    'install.buttonAria': 'Install app on this device',
    'install.closeAria': 'Close installation guide'
  };

  var SHARE_ICON = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3m0 0L8 7m4-4 4 4"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
  var HOME_ICON = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 9v6M9 12h6"/></svg>';

  function init() {
    var style = document.createElement('style');
    style.id = 'iosInstallStyle';
    style.textContent = [
      '#iosInstallBtn{display:none!important;align-items:center;gap:6px;padding:6px 9px;border-radius:10px;border:1px solid rgba(148,163,184,.32);background:rgba(148,163,184,.10);color:inherit;font-family:inherit;font-size:11px;font-weight:600;line-height:1.2;letter-spacing:.01em;white-space:nowrap;hyphens:none;word-break:keep-all;cursor:pointer;-webkit-tap-highlight-color:transparent}',
      '#iosInstallBtn.is-visible{display:inline-flex!important}',
      '#iosInstallBtn svg{width:14px;height:14px;flex:none}',
      '.ios-install-label{white-space:nowrap;hyphens:none}',
      '#iosInstallGuide{position:fixed;inset:0;z-index:2147483640;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(4,7,14,.62);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}',
      '#iosInstallGuide[hidden]{display:none!important}',
      '.ios-install-card{position:relative;width:100%;max-width:420px;padding:24px 20px 18px;border-radius:18px;border:1px solid rgba(255,255,255,.14);background:#121722;color:#eef2f8;box-shadow:0 24px 70px rgba(0,0,0,.5);font-family:inherit}',
      '.ios-install-kicker{display:inline-block;margin-bottom:8px;padding:3px 8px;border-radius:999px;background:rgba(129,140,248,.18);color:#c7d2fe;font-size:10px;font-weight:700;letter-spacing:.12em}',
      '.ios-install-title{margin:0 34px 18px 0;font-size:18px;line-height:1.3;font-weight:700;white-space:nowrap;hyphens:none;overflow-wrap:normal}',
      '.ios-install-x{position:absolute;top:12px;right:12px;width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:8px;background:rgba(255,255,255,.08);color:inherit;font-size:19px;line-height:1;cursor:pointer}',
      '.ios-install-steps{list-style:none;margin:0;padding:0;display:grid;gap:12px}',
      '.ios-install-step{display:flex;align-items:flex-start;gap:11px;padding:12px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}',
      '.ios-install-num{flex:none;width:23px;height:23px;display:grid;place-items:center;border-radius:50%;background:#6366f1;color:#fff;font-size:12px;font-weight:700}',
      '.ios-install-step-body{display:flex;align-items:flex-start;gap:9px;min-width:0}',
      '.ios-install-step-body svg{flex:none;margin-top:2px;color:#a5b4fc}',
      '.ios-install-step-body p{margin:0;font-size:13px;line-height:1.45;hyphens:none;overflow-wrap:break-word}',
      '.ios-install-done{display:block;width:100%;margin-top:16px;padding:10px;border:0;border-radius:10px;background:#6366f1;color:#fff;font-family:inherit;font-size:13px;font-weight:700;white-space:nowrap;hyphens:none;cursor:pointer}'
    ].join('\n');
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.id = 'iosInstallBtn';
    btn.type = 'button';
    btn.className = 'ios-install-btn';
    btn.setAttribute('data-ios-i18n-aria', 'install.buttonAria');
    btn.innerHTML = SHARE_ICON + '<span class="ios-install-label" data-ios-i18n="install.button">Install app</span>';

    var guide = document.createElement('div');
    guide.id = 'iosInstallGuide';
    guide.className = 'ios-install-guide';
    guide.setAttribute('role', 'dialog');
    guide.setAttribute('aria-modal', 'true');
    guide.setAttribute('aria-labelledby', 'iosInstallGuideTitle');
    guide.hidden = true;
    guide.innerHTML = '<div class="ios-install-card">' +
      '<button type="button" class="ios-install-x" id="iosInstallClose" aria-label="Close installation guide" data-ios-i18n-aria="install.closeAria">&times;</button>' +
      '<span class="ios-install-kicker" aria-hidden="true">iOS</span>' +
      '<h2 class="ios-install-title" id="iosInstallGuideTitle" data-ios-i18n="install.guideTitle">Install on iPhone or iPad</h2>' +
      '<ol class="ios-install-steps">' +
        '<li class="ios-install-step"><span class="ios-install-num" aria-hidden="true">1</span><div class="ios-install-step-body">' + SHARE_ICON + '<p data-ios-i18n="install.step1">Tap the Share icon in Safari’s toolbar</p></div></li>' +
        '<li class="ios-install-step"><span class="ios-install-num" aria-hidden="true">2</span><div class="ios-install-step-body">' + HOME_ICON + '<p data-ios-i18n="install.step2">Choose “Add to Home Screen”</p></div></li>' +
      '</ol>' +
      '<button type="button" class="ios-install-done" id="iosInstallDone" data-ios-i18n="install.close">Close</button>' +
    '</div>';

    var host = document.querySelector(CFG.host);
    if (!host) return;
    host.appendChild(btn);
    document.body.appendChild(guide);

    function currentLang() {
      var sel = document.querySelector(CFG.langSelect);
      var v = sel && sel.value;
      if (!v) v = document.documentElement.getAttribute('lang') || navigator.language || CFG.fallback;
      return String(v).toLowerCase().split('-')[0];
    }

    function tr(key) {
      var v = CFG.lookup(key, currentLang());
      if (typeof v !== 'string' || !v) v = CFG.lookup(key, CFG.fallback);
      return (typeof v === 'string' && v) ? v : DEFAULTS[key];
    }

    function applyText() {
      var nodes = guide.querySelectorAll('[data-ios-i18n]');
      Array.prototype.forEach.call(nodes, function (el) { el.textContent = tr(el.getAttribute('data-ios-i18n')); });
      nodes = [btn].concat(Array.prototype.slice.call(guide.querySelectorAll('[data-ios-i18n-aria]')));
      nodes.forEach(function (el) { el.setAttribute('aria-label', tr(el.getAttribute('data-ios-i18n-aria'))); });
    }

    function isIOSBrowser() {
      var ua = navigator.userAgent || '';
      return /iPad|iPhone|iPod/.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    function isStandalone() {
      return !!(window.navigator.standalone ||
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches));
    }

    function shouldShow() { return isIOSBrowser() && !isStandalone(); }

    function closeGuide(restoreFocus) {
      if (guide.hidden) return;
      guide.hidden = true;
      if (restoreFocus !== false) { try { btn.focus(); } catch (e) {} }
    }

    function sync() {
      var show = shouldShow();
      btn.classList.toggle('is-visible', show);
      btn.tabIndex = show ? 0 : -1;
      if (!show) closeGuide(false);
    }

    btn.addEventListener('click', function () {
      if (!shouldShow()) return;
      applyText();
      guide.hidden = false;
      try { document.getElementById('iosInstallClose').focus(); } catch (e) {}
    });

    document.getElementById('iosInstallClose').addEventListener('click', function () { closeGuide(true); });
    document.getElementById('iosInstallDone').addEventListener('click', function () { closeGuide(true); });
    guide.addEventListener('click', function (e) { if (e.target === guide) closeGuide(true); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Esc') closeGuide(true); });

    var langSel = document.querySelector(CFG.langSelect);
    if (langSel) langSel.addEventListener('change', function () { setTimeout(applyText, 0); });
    ['ac:langchange', 'gv:languagechange', 'sleep:langchange', 'study:langchange'].forEach(function (name) {
      document.addEventListener(name, function () { setTimeout(applyText, 0); });
      window.addEventListener(name, function () { setTimeout(applyText, 0); });
    });
    try {
      var mo = new MutationObserver(function () { applyText(); });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    } catch (e) {}

    window.addEventListener('pageshow', sync);
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);

    applyText();
    sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
