// ✅ components/ServiceWorkerProvider.tsx (NOVO)

'use client'

import { useEffect } from 'react'

export default function ServiceWorkerProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => {
          console.log('✅ Service Worker registrado:', reg)
        })
        .catch(err => {
          console.error('❌ Erro ao registrar Service Worker:', err)
        })
    }
  }, [])

  return null
}