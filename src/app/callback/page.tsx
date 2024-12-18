'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.slice(1))
      const state = params.get('state')
      const storedState = localStorage.getItem('spotify_auth_state')

      if (state === storedState) {
        const accessToken = params.get('access_token')
        if (accessToken) {
          localStorage.setItem('spotify_token', accessToken)
          router.push('/')
        }
      } else {
        console.error('Estado inválido. Possível ataque CSRF detectado.')
      }
    }
  }, [router])

  return <p>Processando autenticação...</p>
}
