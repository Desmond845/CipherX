self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting()); // ACTIVATE IMMEDIATELY
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim()); // CONTROL ALL PAGES
});

self.addEventListener('push', function(event) {
  // Handle push events if you use push notifications
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // Focus existing window or open new one
      for (let client of windowClients) {
        if (client.url.includes('#home') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/app.html');
      }
    })
  );
});