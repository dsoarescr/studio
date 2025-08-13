// Service Worker for Pixel Universe
const CACHE_NAME = 'pixel-universe-v1';
const STATIC_CACHE_NAME = 'pixel-universe-static-v1';
const DYNAMIC_CACHE_NAME = 'pixel-universe-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/apple-icon.png',
  '/sounds/achievement.mp3',
  '/sounds/click.mp3',
  '/sounds/error.mp3',
  '/sounds/notification.mp3',
  '/sounds/purchase.mp3',
  '/sounds/success.mp3',
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/api\.pixeluniverse\.pt\//,
  /^https:\/\/fonts\.googleapis\.com\//,
  /^https:\/\/fonts\.gstatic\.com\//,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('pixel-universe-')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests
  if (STATIC_ASSETS.includes(url.pathname)) {
    // Static assets - Cache First strategy
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
    // API requests - Network First strategy
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
  } else if (url.pathname.startsWith('/_next/static/')) {
    // Next.js static assets - Cache First strategy
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (url.pathname.startsWith('/api/')) {
    // API routes - Network Only (don't cache sensitive data)
    return;
  } else {
    // Other requests - Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
  }
});

// Cache First strategy - good for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Cache hit:', request.url);
      return cachedResponse;
    }
    
    console.log('[SW] Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline - Asset not available', { status: 503 });
  }
}

// Network First strategy - good for API data
async function networkFirst(request, cacheName) {
  try {
    console.log('[SW] Network first:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline - Data not available', { status: 503 });
  }
}

// Stale While Revalidate - good for dynamic content
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    console.log('[SW] Stale while revalidate - cache hit:', request.url);
    return cachedResponse;
  }
  
  // Otherwise wait for network
  console.log('[SW] Stale while revalidate - waiting for network:', request.url);
  return fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'pixel-purchase') {
    event.waitUntil(syncPixelPurchases());
  } else if (event.tag === 'user-actions') {
    event.waitUntil(syncUserActions());
  }
});

// Sync pixel purchases when back online
async function syncPixelPurchases() {
  try {
    const pendingPurchases = await getStoredData('pendingPurchases');
    
    for (const purchase of pendingPurchases) {
      try {
        const response = await fetch('/api/pixels/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(purchase),
        });
        
        if (response.ok) {
          console.log('[SW] Synced pixel purchase:', purchase.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync purchase:', error);
      }
    }
    
    // Clear synced purchases
    await clearStoredData('pendingPurchases');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync user actions when back online
async function syncUserActions() {
  try {
    const pendingActions = await getStoredData('pendingActions');
    
    for (const action of pendingActions) {
      try {
        const response = await fetch('/api/user/actions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action),
        });
        
        if (response.ok) {
          console.log('[SW] Synced user action:', action.type);
        }
      } catch (error) {
        console.error('[SW] Failed to sync action:', error);
      }
    }
    
    await clearStoredData('pendingActions');
  } catch (error) {
    console.error('[SW] User actions sync failed:', error);
  }
}

// Helper functions for IndexedDB storage
async function getStoredData(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PixelUniverseDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offline'], 'readonly');
      const store = transaction.objectStore('offline');
      const getRequest = store.get(key);
      
      getRequest.onsuccess = () => resolve(getRequest.result?.data || []);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('offline')) {
        db.createObjectStore('offline', { keyPath: 'key' });
      }
    };
  });
}

async function clearStoredData(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PixelUniverseDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offline'], 'readwrite');
      const store = transaction.objectStore('offline');
      const deleteRequest = store.delete(key);
      
      deleteRequest.onsuccess = () => resolve(true);
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nova atividade no Pixel Universe!',
      icon: '/logo.png',
      badge: '/apple-icon.png',
      tag: data.tag || 'pixel-universe',
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'Ver',
          icon: '/logo.png'
        },
        {
          action: 'dismiss',
          title: 'Dispensar'
        }
      ],
      vibrate: [200, 100, 200],
      requireInteraction: data.important || false,
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Pixel Universe', options)
    );
  } catch (error) {
    console.error('[SW] Push notification error:', error);
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_PIXEL_DATA') {
    // Cache pixel data for offline use
    caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
      cache.put('/api/pixels/data', new Response(JSON.stringify(event.data.pixels)));
    });
  }
});

console.log('[SW] Service Worker loaded successfully');