/**
 * Service Worker for Cyberpunk GM Screen
 * Enables offline functionality and PWA features
 */

const CACHE_NAME = 'cyberpunk-gm-screen-v1.0.0';
const RUNTIME_CACHE = 'cyberpunk-runtime';

// Assets to cache for offline use
const STATIC_ASSETS = [
  './cyberpunk-gm-screen.html',
  './manifest.json',
  './src/css/cyberpunk-variables.css',
  './src/css/cyberpunk-reset.css',
  './src/css/cyberpunk-typography.css',
  './src/css/styles-modern.css',
  './src/css/styles-enhanced.css',
  './src/fonts/Cyberpunk.woff2',
  './src/fonts/Acquire.woff2',
  './src/fonts/VeniteAdoremus.woff2',
  './src/fonts/Angora.woff2',
  './src/js/cyberpunk-background.js',
  './src/js/theme-manager.js',
  './src/js/enhanced-panel-system-fixed.js',
  './src/js/enhanced-dice-roller-fixed.js',
  './src/js/advanced-combat-tracker-fixed.js',
  './src/js/npc-generator.js',
  './src/js/rules-reference.js',
  './src/js/panel-utils.js',
  './src/js/notes-text-editor.js',
  './src/js/module-index.js',
  './src/js/panel-templates.js',
  './src/js/help-system.js',
  './src/js/campaign-manager.js',
  './src/js/performance-optimizer.js',
  './src/js/sound-manager.js',
  './src/components/holo-button.js',
  './src/components/neon-input.js',
  './src/components/loading-spinner.js',
  './src/components/error-message.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          // Update cache in background for next time
          if (navigator.onLine) {
            fetchAndCache(request);
          }
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetchAndCache(request);
      })
      .catch((error) => {
        console.error('[Service Worker] Fetch failed:', error);
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('./cyberpunk-gm-screen.html');
        }
        
        // Return error response
        return new Response('Offline - Resource not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});

// Helper function to fetch and cache
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    
    // Only cache successful responses
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }
    
    // Clone the response
    const responseToCache = response.clone();
    
    // Open runtime cache and store the response
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, responseToCache);
    
    return response;
  } catch (error) {
    console.error('[Service Worker] Fetch error:', error);
    throw error;
  }
}

// Background sync for campaign data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-campaign-data') {
    event.waitUntil(syncCampaignData());
  }
});

async function syncCampaignData() {
  try {
    // Get all clients
    const clients = await self.clients.matchAll();
    
    // Send message to clients to trigger sync
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_CAMPAIGN_DATA'
      });
    });
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_CAMPAIGN_DATA') {
    caches.open(RUNTIME_CACHE).then(cache => {
      const campaignData = new Response(JSON.stringify(event.data.data));
      cache.put('./campaign-data.json', campaignData);
    });
  }
});

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdates());
  }
});

async function checkForUpdates() {
  try {
    // Check if any static assets have been updated
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await fetch(request);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse && response) {
        const newETag = response.headers.get('etag');
        const cachedETag = cachedResponse.headers.get('etag');
        
        if (newETag && cachedETag && newETag !== cachedETag) {
          // Update available
          await cache.put(request, response);
          
          // Notify clients
          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({
              type: 'UPDATE_AVAILABLE'
            });
          });
        }
      }
    }
  } catch (error) {
    console.error('[Service Worker] Update check failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: './src/images/icon-192x192.png',
    badge: './src/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open GM Screen',
        icon: './src/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: './src/images/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Cyberpunk GM Screen', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./cyberpunk-gm-screen.html')
    );
  }
});

console.log('[Service Worker] Loaded');