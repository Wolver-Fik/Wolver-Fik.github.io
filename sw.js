/* Wolver-Fik Suite — service worker del portal hub. */
const CACHE = 'wf-suite-v1.2.0';

const CORE_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/apps.js',
  './js/app.js',
  './js/i18n/en.js',
  './js/i18n/es.js',
  './js/i18n/pt.js',
  './js/i18n/fr.js',
  './js/i18n/it.js',
  './js/i18n/de.js',
  './js/i18n/ru.js',
  './js/i18n/ja.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

const SCOPE = self.registration.scope;
const HUB_ROOT = new URL('./', SCOPE).href;
const HUB_INDEX = new URL('./index.html', SCOPE).href;
const HUB_URLS = new Set(CORE_ASSETS.map((path) => new URL(path, SCOPE).href));

/* El hub y las seis PWA comparten origen, pero no caché. Solo gestionamos los
 * archivos del portal: las rutas /PulseFit/, /ClearWallet/, etc. las atiende
 * el service worker de cada aplicación. */
function hubTarget(url) {
  const target = new URL(url.pathname, SCOPE).href;
  return HUB_URLS.has(target) ? target : null;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.indexOf('wf-suite-') === 0 && key !== CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const target = hubTarget(url);
  if (!target) return;

  const isHTML = request.mode === 'navigate' ||
    target === HUB_ROOT ||
    target === HUB_INDEX ||
    (request.headers.get('accept') || '').includes('text/html');

  // HTML del hub: Network-First, con la página del portal como respaldo offline.
  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE)
              .then((cache) => cache.put(target, copy))
              .catch(() => {});
          }
          return response;
        })
        .catch(() => caches.open(CACHE).then((cache) =>
          cache.match(HUB_INDEX).then((cached) => cached || cache.match(HUB_ROOT))
        ).then((cached) => cached || Response.error()))
    );
    return;
  }

  // Recursos estáticos del hub: Cache-First con revalidación en segundo plano.
  event.respondWith(
    caches.open(CACHE).then((cache) => cache.match(target)).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE)
              .then((store) => store.put(target, copy))
              .catch(() => {});
          }
          return response;
        })
        .catch(() => null);

      if (cached) {
        network.catch(() => {});
        return cached;
      }
      return network.then((response) => response || Response.error());
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
