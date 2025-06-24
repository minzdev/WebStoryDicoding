const CACHE_NAME = 'storyn-app-v1';
const API_URL = 'https://story-api.dicoding.dev';

const ASSETS = [
  '/',
  '/index.html',
  '/bundle.js',
  '/main.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json',
];

// Cache aset saat instalasi
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Hapus cache lama saat aktivasi
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Strategi fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Tangani API
  if (url.origin === API_URL) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({ error: true, message: 'Tidak dapat terhubung ke server.' }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      )
    );
    return;
  }

  // Abaikan permintaan ke tile OpenStreetMap (tidak dicache)
  if (url.hostname.includes('tile.openstreetmap.org')) return;

  // Cache-first untuk aset lokal
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// Push Notification
self.addEventListener('push', (event) => {
  let data = {
    title: 'Notifikasi Baru',
    options: {
      body: 'Ada cerita baru yang telah ditambahkan!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
    },
  };

  if (event.data) {
    try {
      const json = event.data.json();
      data.title = json.title || data.title;
      data.options = { ...data.options, ...json.options };
    } catch (e) {
      data.options.body = event.data.text();
    }
  }

  event.waitUntil(self.registration.showNotification(data.title, data.options));
});

// Klik notifikasi
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
