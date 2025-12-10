// self.addEventListener("install", function (event) {
//   event.waitUntil(self.skipWaiting()); // ACTIVATE IMMEDIATELY
// });
const CACHE = 'growthgrid-v1.4';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        '/CipherX/',
        '/CipherX/index.html',
          '/CipherX/app.html',
        '/CipherX/loader1.html',
        '/CipherX/loader2.html',
        '/CipherX/loader3.html',
        '/CipherX/loader4.html',
        '/CipherX/landing.html',
        '/CipherX/getting-started.html',
                '/CipherX/sitemap.xml',
        '/CipherX/robots.txt',

        '/CipherX/style.css',
        '/CipherX/script.js',
        '/CipherX/ciph.png'
      ]);
    })
  );
  self.skipWaiting();
});
self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim()); // CONTROL ALL PAGES
});

self.addEventListener("push", function (event) {
  // Handle push events if you use push notifications
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Focus existing window or open new one
      for (let client of windowClients) {
        if (client.url.includes("#home") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/app.html");
      }
    })
  );
});
// self.addEventListener('fetch', e => {
//   e.respondWith(
//     caches.match(e.request).then(response => {
//       return response || fetch(e.request);
//     })
//   );
// })
