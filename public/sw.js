// ✅ public/sw.js (NOVO)

const CACHE_NAME = 'cultua-v1'
const URLS_TO_CACHE = [
  '/',
  '/offline.html',
]

// Install event
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...')
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Cache criado')
      return cache.addAll(URLS_TO_CACHE)
    })
  )
})

// Activate event
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deletando cache antigo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event
self.addEventListener('fetch', event => {
  const { request } = event

  // Apenas cache GET requests
  if (request.method !== 'GET') {
    return
  }

  // Network first, fallback para cache
  event.respondWith(
    fetch(request)
      .then(response => {
        // Não cache respostas não-OK
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }

        // Clonar e guardar no cache
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache)
        })

        return response
      })
      .catch(() => {
        // Fallback para cache quando offline
        return caches.match(request).then(cachedResponse => {
          return cachedResponse || new Response('Offline - Conteúdo não disponível', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          })
        })
      })
  )
})