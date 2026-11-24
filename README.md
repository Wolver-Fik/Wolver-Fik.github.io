# Wolver-Fik Suite

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Wolver--Fik%20Suite-6366F1)](https://wolver-fik.github.io/)
[![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-E0A96D?style=flat-square)](LICENSE)

[English](#english) · [Español](#español)



---
<a id="english"></a>

## English

The official hub for the Wolver-Fik Progressive Web Apps: a dark editorial command center to discover, search and launch every app in the ecosystem. Everything runs in the browser — no servers, no accounts, no tracking.

**👉 [Open the live portal](https://wolver-fik.github.io/) · [GitHub profile](https://github.com/Wolver-Fik)**

## Highlights

- **100% offline-first** — service worker with a Network-First strategy for HTML and a precached shell.
- **Privacy by design** — no analytics, no external fonts, no backend. Language preference stays in `localStorage`.
- **8 languages** — English, Spanish, Portuguese, French, Italian, German, Russian and Japanese, with automatic detection via `navigator.language`.
- **Instant catalog** — live search with accent-insensitive matching plus four category filters.
- **Mobile hardened** — `viewport-fit=cover`, safe-area insets for iPhone/Android and maskable icons.
- **Portable** — every app in the suite imports and exports its data as JSON/CSV.

## Apps in the catalog

| App | Category | Live demo |
| --- | --- | --- |
| PulseFit | Health & Wellness | [wolver-fik.github.io/PulseFit](https://wolver-fik.github.io/PulseFit/) |
| ClearWallet | Finance & Vehicles | [wolver-fik.github.io/ClearWallet](https://wolver-fik.github.io/ClearWallet/) |
| AutoCare | Finance & Vehicles | [wolver-fik.github.io/AutoCare](https://wolver-fik.github.io/AutoCare/) |
| GameVault | Games & Culture | [wolver-fik.github.io/GameVault](https://wolver-fik.github.io/GameVault/) |
| SleepTrack | Health & Wellness | [wolver-fik.github.io/SleepTrack](https://wolver-fik.github.io/SleepTrack/) |
| StudyFlow | Productivity & Study | [wolver-fik.github.io/StudyFlow](https://wolver-fik.github.io/StudyFlow/) |

## Structure

```text
.
├── index.html               # Semantic markup + inline WF monogram
├── css/styles.css           # Dark editorial design system + safe areas
├── js/apps.js               # Catalog data, links and custom SVG isotypes
├── js/app.js                # i18n runtime, search, filters, SW registration
├── js/i18n/*.js             # Eight modular locale dictionaries (key parity enforced)
├── icons/                   # icon.svg + PNG 180/192/512 (Pillow generated)
├── manifest.webmanifest     # Installable PWA metadata
├── sw.js                    # wf-suite-v1.0.0 cache strategy
├── LICENSE                  # PolyForm Noncommercial License 1.0.0
└── README.md
```

## License

Copyright (c) 2026 Wolver-Fik. Licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE). Noncommercial use only.

---

<a id="español"></a>

## Español

Centro de mando oficial de las Progressive Web Apps de Wolver-Fik: una interfaz editorial oscura para buscar y abrir todas las aplicaciones del ecosistema. Todo funciona en el navegador: sin servidores, sin cuentas y sin rastreo.

**👉 [Abrir el portal en vivo](https://wolver-fik.github.io/) · [Perfil en GitHub](https://github.com/Wolver-Fik)**

## Características

- **100% offline-first** — service worker con estrategia Network-First para HTML y carcasa precargada.
- **Privacidad por diseño** — sin analíticas, fuentes externas ni backend. El idioma se guarda en `localStorage`.
- **8 idiomas** — inglés, español, portugués, francés, italiano, alemán, ruso y japonés, con detección automática vía `navigator.language`.
- **Catálogo instantáneo** — búsqueda en vivo sin distinguir tildes y cuatro filtros por categoría.
- **Blindaje móvil** — `viewport-fit=cover`, `safe-area-inset` para iPhone/Android e iconos maskable.
- **Portabilidad** — cada app de la suite importa y exporta sus datos en JSON/CSV.

## Estructura

Igual que la descrita arriba: `index.html`, `css/`, `js/` (con `i18n/`), `icons/`, `manifest.webmanifest`, `sw.js`, `LICENSE` y este README.

## Licencia

Copyright (c) 2026 Wolver-Fik. Bajo la [PolyForm Noncommercial License 1.0.0](LICENSE). Solo uso no comercial.
