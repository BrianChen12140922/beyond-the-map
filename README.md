# Beyond the Map · 風水之外

> ⚠ **Before deployment:** Run a project-wide find-and-replace from `PLACEHOLDER_DEPLOY_DOMAIN` to your real GitHub Pages domain (e.g. `username.github.io/beyond-the-map`). Affects all HTML files in the project root and `routes/`, plus this README. (`sw.js` uses `self.registration.scope` only — no domain string to replace.)

A contemplative web atlas of seven Hong Kong walking routes — MacLehose Trail, Lion Rock, Dragon's Back, Lantau Peak, Cheung Chau, Pat Sin Leng, and Sunset Peak — read through the lens of feng shui, temples, festivals, and Daoist cosmology. The site pairs a hand-drawn interactive map, a myths knowledge hub, a photographic gallery, and a feedback form, all built as a static site with no build step.

## Course

- **AST10962** Introduction to the Web — Phase 2 Group Project
- **CGE13220** Programming for Everyone (related cultural-tourism work)
- **UOW College Hong Kong**, Semester B 2025–26

## Team

| Name | Student ID | Role |
|------|-----------|------|
| _Member 1_ | `_______` | _to fill in_ |
| _Member 2_ | `_______` | _to fill in_ |
| _Member 3_ | `_______` | _to fill in_ |
| _Member 4_ | `_______` | _to fill in_ |
| _Member 5_ | `_______` | _to fill in_ |

## Live URL

GitHub Pages (placeholder): <https://PLACEHOLDER_DEPLOY_DOMAIN/beyond-the-map/>

## Tech Stack

- **HTML5**, **CSS3** (custom design tokens, no framework), **vanilla JavaScript**
- **Three.js r134** — hero mist particle scene
- **GSAP 3.12.5** + **ScrollTrigger** — entry animations and scrollytelling
- **Lenis 1.1.13** — smooth-scroll engine (loaded but not hijacking)
- **Splitting.js** — character-level hero title animation
- **Google Fonts**: Fraunces · Manrope · Noto Serif TC · Noto Sans TC · JetBrains Mono

All third-party libraries load via CDN. There is **no build step** — open any `.html` file directly or serve the folder.

## Progressive Web App

The site is **installable** on supported browsers (Chrome/Edge/Android; Safari on iOS via “Add to Home Screen” using the web app manifest + `apple-touch-icon`). After the first visit while online, a **service worker** (`sw.js`) caches the main HTML pages, CSS, JavaScript, route photos, Open Graph image, Google Fonts CSS, and core CDN scripts so hikers can **read cached trail content offline** in areas with no signal.

- **Install prompt** — eligible users may see a small toast to install the app; dismissal is remembered in `localStorage` (`btm-pwa-install-dismissed`).
- **Offline indicator** — when `navigator.onLine` is false, a banner appears: cached pages and assets still load from `btm-cache-v1`; live weather (Open-Meteo) uses `btm-runtime-v1` with last-fetched data when possible.
- **Approximate cache footprint** — about **3 MB** after precache (varies slightly with icon assets once added).

**Deploying to a GitHub Pages project site** (for example `https://username.github.io/repo-name/`): change `start_url` and `scope` in `manifest.webmanifest` from `/index.html` and `/` to paths under the repo (for example `./index.html` and `./`) so the installed shortcut opens the correct URL.

### App icons (add under `assets/images/`)

| File | Size | Purpose |
|------|------|---------|
| `icon-192.png` | **192×192 px** | Launcher + `apple-touch-icon` |
| `icon-512.png` | **512×512 px** | Splash / high-res launcher |
| `icon-512-maskable.png` | **512×512 px** | Adaptive / maskable (`purpose: maskable`) |

**Maskable safe zone:** treat the canvas as a square; keep logos, text, and critical detail inside the **inner ~80% diameter circle** (nothing important in the outer rim). Android applies circular or rounded-rectangle masks; content at the edges may be clipped. Export PNG with sRGB, solid or transparent background as preferred.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a modern browser (Chrome, Safari, Firefox, Edge).

## Project structure

```
beyond-the-map/
├── index.html              ← landing page (hero, bento, regions, trail map)
├── explore.html            ← seven route cards
├── myths.html              ← myths knowledge hub + feng shui timeline
├── map.html                ← interactive SVG trail map
├── gallery.html            ← masonry photo gallery + lightbox
├── about.html              ← project rationale, references, feedback form
├── 404.html                ← off-the-map error page
├── compare.html            ← side-by-side route comparison
├── manifest.webmanifest    ← PWA manifest (install + theme colours)
├── sw.js                   ← service worker (offline caching)
├── README.md
├── style.css               ← single design-system stylesheet
├── main.js                 ← all interactions, animations, language toggle
├── routes/
│   ├── maclehose.html
│   ├── lion-rock.html
│   ├── dragons-back.html
│   ├── lantau.html
│   ├── cheung-chau.html
│   ├── pat-sin-leng.html
│   └── sunset-peak.html
└── assets/
    └── images/
        ├── route-maclehose.jpg
        ├── route-lion-rock.jpg
        ├── route-dragons-back.jpg
        ├── route-lantau.jpg
        ├── route-cheung-chau.jpg
        ├── route-pat-sin-leng.jpg
        ├── route-sunset-peak.jpg
        ├── og-cover.jpg     ← social share preview (1200 × 630)
        ├── icon-192.png     ← PWA / Apple touch icon (add if missing)
        ├── icon-512.png
        └── icon-512-maskable.png
```

## Accessibility notes

- **Skip-link** — first focusable element on every page jumps straight to `#main`.
- **Reduced motion** — all GSAP, mist canvas, and CSS transitions respect `prefers-reduced-motion: reduce`.
- **ARIA** — landmarks (`role="banner"`, `role="navigation"`, `role="main"`, `role="contentinfo"`); `aria-label` / `aria-expanded` / `aria-current` / `aria-pressed` / `aria-modal` / `aria-live` used throughout the nav, mobile drawer, filter buttons, lightbox, timeline tabs, and feedback form.
- **Keyboard navigation** — every interactive control is reachable via Tab; lightbox and mobile drawer trap focus while open and restore focus on close; timeline tabs accept ←/→/Home/End.
- **Bilingual content** — `lang="zh-Hant"` is set on every Traditional Chinese fragment; the EN ⇄ 繁 toggle updates `<html lang>` and persists in `localStorage` under `btm-lang`.
- **Contrast** — body copy and brass accents pass WCAG AA against the ink-900 background.
- **Color** — no information is conveyed by color alone; filter and active states pair color shifts with text/iconography.

## References

The full annotated source list lives on the **About** page → see the "References" section in [`about.html`](./about.html). It covers AFCD Country Parks materials, HKTB cultural pages, Sik Sik Yuen Wong Tai Sin Temple records, the Pat Sin Leng memorial documentation, and academic writing on Hong Kong feng shui and ridge geography.

## License

Educational use only. Created by students of UOW College Hong Kong for the AST10962 / CGE13220 coursework, Semester B 2025–26. Photographs and trail data remain the property of their original authors and HK Government departments where credited; please do not redistribute.
