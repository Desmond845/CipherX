const CACHE = 'cipherx-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        './',
        './app.html',
        './style.css',
        './script.js',
        // './manifest.json',
        // './icon-192.png',
        // './icon-512.png'
        './ciph.png'
      ]);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsList => {
      // Focus existing tab
      for (let client of clientsList) {
        if (client.url.includes(location.pathname.split('/')[1] || '') && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new tab
      if (clients.openWindow) {
        return clients.openWindow('./app.html');
      }
    })
  );
});
