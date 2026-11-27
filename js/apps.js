/* Wolver-Fik Suite — catálogo editorial de aplicaciones.
 * Los textos traducibles viven en js/i18n/*.js; aquí solo se definen los datos
 * estructurales, los enlaces y los isotipos SVG de cada aplicación.
 */
(function (global) {
  'use strict';

  function mark(body) {
    return '<svg class="app-icon" viewBox="0 0 64 64" width="36" height="36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + body + '</svg>';
  }

  var ICONS = {
    pulsefit: mark(
      '<rect x="4" y="4" width="56" height="56" rx="16" fill="#FF7A7A" fill-opacity=".12" stroke="#FF7A7A" stroke-opacity=".35"/>' +
      '<path d="M32 48S15 38.5 15 27.2A9.2 9.2 0 0 1 32 22a9.2 9.2 0 0 1 17 5.2C49 38.5 32 48 32 48Z" fill="none" stroke="#FF7A7A" stroke-width="3.2" stroke-linejoin="round"/>' +
      '<path d="M19.5 32.5h7l3-6 4 11 3.5-7h7" fill="none" stroke="#FFD1C2" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'
    ),
    clearwallet: mark(
      '<rect x="4" y="4" width="56" height="56" rx="16" fill="#34D399" fill-opacity=".12" stroke="#34D399" stroke-opacity=".35"/>' +
      '<rect x="12" y="19" width="40" height="28" rx="6.5" fill="none" stroke="#34D399" stroke-width="3"/>' +
      '<path d="M12.5 26.5h39" stroke="#34D399" stroke-width="2.4"/>' +
      '<path d="M40 32.5h11.5v9H40a4.5 4.5 0 0 1 0-9Z" fill="#34D399" fill-opacity=".28" stroke="#34D399" stroke-width="2.4"/>' +
      '<circle cx="44.3" cy="37" r="1.6" fill="#A7F3D0"/>'
    ),
    autocare: mark(
      '<rect x="4" y="4" width="56" height="56" rx="16" fill="#E0A96D" fill-opacity=".12" stroke="#E0A96D" stroke-opacity=".38"/>' +
      '<path d="M16.5 39.5 19.5 28a4.5 4.5 0 0 1 4.3-3.3h16.4a4.5 4.5 0 0 1 4.3 3.3l3 11.5" fill="none" stroke="#E0A96D" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M14.5 39.5h35" stroke="#E0A96D" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="21.5" cy="44.5" r="3" fill="#141824" stroke="#E0A96D" stroke-width="2.4"/>' +
      '<circle cx="42.5" cy="44.5" r="3" fill="#141824" stroke="#E0A96D" stroke-width="2.4"/>' +
      '<path d="M24 31h16" stroke="#F6D9AE" stroke-width="2.4" stroke-linecap="round"/>'
    ),
    gamevault: mark(
      '<rect x="4" y="4" width="56" height="56" rx="16" fill="#A78BFA" fill-opacity=".12" stroke="#A78BFA" stroke-opacity=".35"/>' +
      '<path d="M20.5 27h23a8 8 0 0 1 7.7 10l-2 6.8a5 5 0 0 1-8.2 2.1l-3.1-3.1H26.1l-3.1 3.1a5 5 0 0 1-8.2-2.1l-2-6.8A8 8 0 0 1 20.5 27Z" fill="none" stroke="#A78BFA" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M22 34v7M18.5 37.5h7" stroke="#DDD6FE" stroke-width="2.6" stroke-linecap="round"/>' +
      '<circle cx="41" cy="34.5" r="2" fill="#A78BFA"/><circle cx="46" cy="40" r="2" fill="#A78BFA"/>'
    ),
    sleeptrack: mark(
      '<rect x="4" y="4" width="56" height="56" rx="16" fill="#60A5FA" fill-opacity=".12" stroke="#60A5FA" stroke-opacity=".35"/>' +
      '<path d="M43.5 41.5A15.5 15.5 0 0 1 24.5 20a15.5 15.5 0 1 0 19 21.5Z" fill="#60A5FA" fill-opacity=".2" stroke="#60A5FA" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="m18.5 15 1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6-3.6-1.4 3.6-1.4L18.5 15Z" fill="#BFDBFE"/>' +
      '<circle cx="44" cy="17" r="2" fill="#BFDBFE"/>'
    ),
    studyflow: mark(
      '<rect x="4" y="4" width="56" height="56" rx="16" fill="#2DD4BF" fill-opacity=".12" stroke="#2DD4BF" stroke-opacity=".35"/>' +
      '<path d="M32 20.5c-4-3-9.2-4-15-3v25c5.8-1 11 0 15 3 4-3 9.2-4 15-3v-25c-5.8-1-11 0-15 3Z" fill="none" stroke="#2DD4BF" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M32 20.5v25" stroke="#2DD4BF" stroke-width="2.6"/>' +
      '<path d="M21 26h6M21 32h5M37 26h6M37 32h5" stroke="#99F6E4" stroke-width="2.2" stroke-linecap="round"/>'
    )
  };

  global.WF_CATEGORIES = ['all', 'health', 'finance', 'leisure', 'productivity', 'inUse'];

  /* Las versiones son las que declara el service worker de cada PWA. Las claves
   * de almacenamiento y los prefijos de caché sirven SOLO para detectar uso en
   * este dispositivo: el portal nunca lee ni modifica los datos de las apps. */
  global.WF_APPS = [
    {
      id: 'pulsefit',
      name: 'PulseFit',
      category: 'health',
      version: 'v1.5',
      status: 'active',
      storageKeys: ['cf_days', 'cf_lifts', 'pulsefit_weekly_plan', 'pulsefit_body_measures'],
      cachePrefixes: ['pulsefit-v'],
      accent: '#FF7A7A',
      icon: ICONS.pulsefit,
      tags: ['apps.pulsefit.tag1', 'apps.pulsefit.tag2', 'apps.pulsefit.tag3', 'apps.pulsefit.tag4', 'apps.pulsefit.tag5', 'apps.pulsefit.tag6', 'apps.pulsefit.tag7', 'apps.pulsefit.tag8'],
      url: 'https://wolver-fik.github.io/PulseFit/',
      source: 'https://github.com/Wolver-Fik/PulseFit'
    },
    {
      id: 'clearwallet',
      name: 'ClearWallet',
      category: 'finance',
      version: 'v1.5',
      status: 'active',
      storageKeys: ['clearwallet-v1', 'plata-al-dia-v1'],
      cachePrefixes: ['clearwallet-v'],
      accent: '#34D399',
      icon: ICONS.clearwallet,
      tags: ['apps.clearwallet.tag1', 'apps.clearwallet.tag2', 'apps.clearwallet.tag3', 'apps.clearwallet.tag4', 'apps.clearwallet.tag5', 'apps.clearwallet.tag6', 'apps.clearwallet.tag7', 'apps.clearwallet.tag8'],
      url: 'https://wolver-fik.github.io/ClearWallet/',
      source: 'https://github.com/Wolver-Fik/ClearWallet'
    },
    {
      id: 'autocare',
      name: 'AutoCare',
      category: 'finance',
      version: 'v1.5',
      status: 'active',
      storageKeys: ['tablero-auto-v1'],
      cachePrefixes: ['autocare-v'],
      accent: '#E0A96D',
      icon: ICONS.autocare,
      tags: ['apps.autocare.tag1', 'apps.autocare.tag2', 'apps.autocare.tag3', 'apps.autocare.tag4', 'apps.autocare.tag5', 'apps.autocare.tag6', 'apps.autocare.tag7', 'apps.autocare.tag8', 'apps.autocare.tag9'],
      url: 'https://wolver-fik.github.io/AutoCare/',
      source: 'https://github.com/Wolver-Fik/AutoCare'
    },
    {
      id: 'gamevault',
      name: 'GameVault',
      category: 'leisure',
      version: 'v1.5',
      status: 'active',
      storageKeys: ['biblioteca-juegos-v1', 'gamevault-owned-platforms-v1', 'gamevault-collections-v1'],
      cachePrefixes: ['gamevault-v'],
      accent: '#A78BFA',
      icon: ICONS.gamevault,
      tags: ['apps.gamevault.tag1', 'apps.gamevault.tag2', 'apps.gamevault.tag3', 'apps.gamevault.tag4', 'apps.gamevault.tag5', 'apps.gamevault.tag6', 'apps.gamevault.tag7', 'apps.gamevault.tag8'],
      url: 'https://wolver-fik.github.io/GameVault/',
      source: 'https://github.com/Wolver-Fik/GameVault'
    },
    {
      id: 'sleeptrack',
      name: 'SleepTrack',
      category: 'health',
      version: 'v1.5',
      status: 'active',
      storageKeys: ['diario-sueno-v1'],
      cachePrefixes: ['sleeptrack-v'],
      accent: '#60A5FA',
      icon: ICONS.sleeptrack,
      tags: ['apps.sleeptrack.tag1', 'apps.sleeptrack.tag2', 'apps.sleeptrack.tag3', 'apps.sleeptrack.tag4', 'apps.sleeptrack.tag5', 'apps.sleeptrack.tag6', 'apps.sleeptrack.tag7', 'apps.sleeptrack.tag8'],
      url: 'https://wolver-fik.github.io/SleepTrack/',
      source: 'https://github.com/Wolver-Fik/SleepTrack'
    },
    {
      id: 'studyflow',
      name: 'StudyFlow',
      category: 'productivity',
      version: 'v1.5',
      status: 'active',
      storageKeys: ['studyflow-v1', 'panel-estudio-v1'],
      cachePrefixes: ['studyflow-v'],
      accent: '#2DD4BF',
      icon: ICONS.studyflow,
      tags: ['apps.studyflow.tag1', 'apps.studyflow.tag2', 'apps.studyflow.tag3', 'apps.studyflow.tag4', 'apps.studyflow.tag5', 'apps.studyflow.tag6', 'apps.studyflow.tag7', 'apps.studyflow.tag8'],
      url: 'https://wolver-fik.github.io/StudyFlow/',
      source: 'https://github.com/Wolver-Fik/StudyFlow'
    }
  ];
})(window);
