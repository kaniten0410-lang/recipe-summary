// sw.js（基本のキャッシュ設定）
const CACHE = "v1";
const FILES = ["/", "../HTML/index.html", "../CSS/style.css", "../javascript/index.js"];

self.addEventListener("install", e =>
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)))
);
self.addEventListener("fetch", e =>
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);