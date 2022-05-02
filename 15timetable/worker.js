const cacheName = "v6.3.1";
const cacheContent = [
  "./",
  "./index.html",
  "./timetable.js",
  "./timetable.css",
  "./manifest.json"
];

//installing Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(cacheContent);
  })());
});

//fetching content using Service Worker
self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    const request = await caches.match(event.request, { "ignoreSearch": true });
    if (request) { return request; }

    const response = await fetch(event.request);
    const cache = await caches.open(cacheName);
    cache.put(event.request, response.clone());
    return response;
  })());
});

//clear cache
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key == cacheName) { return; }
      return caches.delete(key);
    }))
  }));
});
