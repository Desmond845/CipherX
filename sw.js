/// ===================
// CACHE EVERYTHING SERVICE WORKER
// ===================
const CACHE_NAME = 'cipherx-v4.1';
const urlsToCache = [
  '', // Root
  'index.html',
  'style.css',
  'script.js',
  'ciph.png',
  'manifest.json',
  'loader1.html',
    'loader2.html',
  'loader3.html',
  'loader4.html',

];

// INSTALL: Cache all files
self.addEventListener('install', event => {
  console.log('⚙️ SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 SW: Caching files...');
        return cache.addAll(urlsToCache.map(url => 
          url || './' // Handle root path
        ));
      })
      .then(() => {
        console.log('✅ SW: Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(err => {
        console.error('❌ SW: Cache failed:', err);
      })
  );
});

// ACTIVATE: Clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 SW: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ SW: Ready to control pages');
      return self.clients.claim();
    })
  );
});

// FETCH: Network first, cache fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
          .then(cached => {
            if (cached) return cached;
            
            // If no cache, return offline page for HTML
            if (event.request.mode === 'navigate') {
              return caches.match('index.html');
            }
            
            return new Response('Offline', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// ===================
// NOTIFICATION HANDLERS
// ===================

// Handle incoming push notifications
self.addEventListener('push', event => {
  console.log('📬 SW: Push received');
  
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: 'CipherX',
      body: event.data?.text() || 'New notification'
    };
  }
  
  const options = {
    body: data.body || 'New update available!',
    icon: 'ciph.png',
    badge: 'ciph.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'CipherX',
      options
    )
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('👆 SW: Notification clicked');
  
  event.notification.close();
  
  const action = event.action;
  
  if (action === 'dismiss') {
    console.log('Notification dismissed');
    return;
  }
  
  // Default action: focus/open app
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if not found
      if (clients.openWindow) {
        const urlToOpen = event.notification.data?.url || './';
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
// Handle background sync (for offline actions)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-translations') {
    console.log('🔄 SW: Background sync triggered');
    // You could sync pending translations here
  }
});

// Handle messages from main thread
self.addEventListener('message', event => {
  console.log('💬 SW: Message received:', event.data);
  
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_NEW_FILES') {
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(event.data.files))
      .then(() => {
        event.source.postMessage({ type: 'CACHE_COMPLETE' });
      });
  }
});