/* Beyond the Map — service worker (offline shell + runtime caching)
   Bump CACHE_STATIC / CACHE_RUNTIME when precache list changes. */

const CACHE_STATIC = 'btm-cache-v4';
const CACHE_RUNTIME = 'btm-runtime-v4';

const CDN_SHELL = [
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,0..100;1,9..144,300..900,0..100&family=Manrope:wght@300..800&family=Noto+Sans+TC:wght@300;400;700&family=Noto+Serif+TC:wght@400;600;900&family=JetBrains+Mono:wght@300;500&display=swap',
  'https://unpkg.com/splitting/dist/splitting.css',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
  'https://unpkg.com/lenis@1.1.13/dist/lenis.min.js',
  'https://unpkg.com/splitting/dist/splitting.min.js',
];

const LOCAL_PAGES = [
  'index.html',
  'explore.html',
  'myths.html',
  'map.html',
  'gallery.html',
  'about.html',
  '404.html',
  'compare.html',
  'routes/maclehose.html',
  'routes/lion-rock.html',
  'routes/dragons-back.html',
  'routes/lantau.html',
  'routes/cheung-chau.html',
  'routes/pat-sin-leng.html',
  'routes/sunset-peak.html',
];

const LOCAL_ASSETS = [
  'style.css',
  'main.js',
  'glossary.js',
  'manifest.webmanifest',
  'assets/images/route-maclehose.jpg',
  'assets/images/route-lion-rock.jpg',
  'assets/images/route-dragons-back.jpg',
  'assets/images/route-lantau.jpg',
  'assets/images/route-cheung-chau.jpg',
  'assets/images/route-pat-sin-leng.jpg',
  'assets/images/route-sunset-peak.jpg',
  'assets/images/og-cover.jpg',
  'assets/images/icon-192.png',
  'assets/images/icon-512.png',
  'assets/images/icon-512-maskable.png',
];

function scopeUrl(path) {
  return new URL(path, self.registration.scope).href;
}

function precacheList() {
  const local = [...LOCAL_PAGES, ...LOCAL_ASSETS].map(scopeUrl);
  return [...new Set(local.concat(CDN_SHELL))];
}

function isOpenMeteo(url) {
  return url.hostname === 'api.open-meteo.com';
}

function shouldBypass(req) {
  if (req.method !== 'GET') return true;
  const url = new URL(req.url);
  if (url.protocol === 'chrome-extension:') return true;
  return false;
}

function stripSearchParams(request) {
  const url = new URL(request.url);
  if (!url.search) return request;
  url.search = '';
  return new Request(url.href, {
    method: request.method,
    headers: request.headers,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer,
    integrity: request.integrity,
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_STATIC)
      .then((cache) =>
        Promise.all(
          precacheList().map((url) =>
            fetch(url, { cache: 'reload' })
              .then((response) => {
                if (!response.ok && response.type !== 'opaque') {
                  throw new Error('precache HTTP ' + response.status);
                }
                return cache.put(url, response);
              })
              .catch(() => {
                /* Missing optional asset or offline CDN — continue */
              })
          )
        )
      )
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if ((key.startsWith('btm-cache-') && key !== CACHE_STATIC) ||
                (key.startsWith('btm-runtime-') && key !== CACHE_RUNTIME)) {
              return caches.delete(key);
            }
            return Promise.resolve();
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (shouldBypass(req)) return;

  const url = new URL(req.url);

  if (isOpenMeteo(url)) {
    event.respondWith(
      (async () => {
        try {
          const live = await fetch(req);
          const cache = await caches.open(CACHE_RUNTIME);
          cache.put(req, live.clone());
          return live;
        } catch {
          const cached = await caches.match(req);
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      })()
    );
    return;
  }

  const accept = req.headers.get('accept') || '';

  if (accept.includes('text/html') || req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const live = await fetch(req);
          const cache = await caches.open(CACHE_STATIC);
          cache.put(req, live.clone());
          return live;
        } catch {
          let cached = await caches.match(req);
          if (!cached) {
            const path = new URL(req.url).pathname;
            const base = self.registration.scope.replace(/\/$/, '');
            const rel = path.startsWith(base) ? path.slice(base.length).replace(/^\//, '') : path.replace(/^\//, '');
            const candidates = [rel, rel.replace(/^\//, ''), 'index.html'];
            for (const c of candidates) {
              if (!c) continue;
              cached = await caches.match(scopeUrl(c));
              if (cached) break;
            }
          }
          return cached || (await caches.match(scopeUrl('index.html')));
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_STATIC);
      const normalized = stripSearchParams(req);
      let cached = await cache.match(normalized);
      if (cached) return cached;
      cached = await cache.match(req);
      if (cached) return cached;

      try {
        const live = await fetch(req);
        const scope = self.registration.scope;
        if (live.ok && req.url.startsWith(scope)) {
          cache.put(normalized, live.clone());
        }
        return live;
      } catch {
        const fallback = await cache.match(normalized);
        return fallback || Response.error();
      }
    })()
  );
});
