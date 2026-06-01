/* ============================================================
   BIOSCAN 5D · MÓDULO PRO — sw.js (service worker)
   ------------------------------------------------------------
   SCOPE: solo /activar/  → NO toca el diagnóstico en producción.
   ESTRATEGIA:
     - Navegaciones (HTML): network-first (nunca sirve HTML viejo).
     - Estáticos (css/js/img): stale-while-revalidate.
     - Funciones /api/*: SIEMPRE red, nunca cache.
   Sube CACHE_VER cada vez que cambies estáticos para invalidar.
   ============================================================ */
const CACHE_VER = "bioscan-pro-v1";
const PRECACHE = [
  "/activar/",
  "/css/bioscan.css",
  "/css/pro.css",
  "/js/config.js",
  "/js/plan-data.js",
  "/js/pro-app.js",
  "/js/pro-pdf.js",
  "/icono-192.png",
  "/icono-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_VER).then((c) => c.addAll(PRECACHE).catch(() => {})).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VER).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // Solo gestionamos mismo origen
  if (url.origin !== self.location.origin) return;

  // Nunca cachear las funciones / API
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/.netlify/")) return;

  // Navegaciones HTML: network-first
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("/activar/")));
    return;
  }

  // Estáticos: stale-while-revalidate
  if (["style", "script", "image", "font"].includes(req.destination)) {
    e.respondWith(
      caches.open(CACHE_VER).then((cache) =>
        cache.match(req).then((cached) => {
          const net = fetch(req).then((res) => { if (res && res.status === 200) cache.put(req, res.clone()); return res; }).catch(() => cached);
          return cached || net;
        })
      )
    );
  }
});
