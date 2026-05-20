const CACHE_NAME = "galaxy-journey-v1";
const APP_SHELL = [
  "/",
  "/manifest.json",
  "/assets/app-icon.svg",
  "/assets/astronaut.svg",
  "/assets/rocket.svg",
  "/assets/dashboard.svg",
  "/assets/certificate.svg",
  "/assets/rewards.svg",
  "/assets/planet.svg",
  "/assets/certificate-bases/discipline.png",
  "/assets/certificate-bases/confidence.png",
  "/assets/certificate-bases/brain-booster.png",
  "/assets/certificate-bases/galaxy-hero.png",
  "/assets/certificate-bases/champions-badge.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("/"));
    })
  );
});
