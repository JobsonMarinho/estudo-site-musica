'use client'

import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { Artist, PlaylistSimplified } from 'spotify-web-sdk'
import { initSpotify } from './services/spotify-api'

interface SpotifyContextType {
  token: string;
  setToken: (token: string) => void;
  artists: Artist[] | null;
  setArtists: (artists: Artist[]) => void;
  playlists: PlaylistSimplified[] | null;
  setPlaylists: (playlists: PlaylistSimplified[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  refreshAccessToken: () => Promise<void>;
}

export const SpotifyContext = createContext<SpotifyContextType>({
  token: '',
  setToken: () => { },
  artists: null,
  setArtists: () => { },
  playlists: null,
  setPlaylists: () => { },
  loading: false,
  setLoading: () => { },
  error: null,
  setError: () => { },
  refreshAccessToken: async () => { },
})

// Memoize the context value to prevent unnecessary re-renders
const useSpotifyValue = () => {
  const [token, setToken] = useState<string>('')
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [artists, setArtists] = useState<Artist[] | null>(null)
  const [playlists, setPlaylists] = useState<PlaylistSimplified[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return

    try {
      const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!
      const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!
      const url = 'https://accounts.spotify.com/api/token'

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      const newToken = data.access_token
      setToken(newToken)
      localStorage.setItem('spotify_token', newToken)
      initSpotify(newToken)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh token')
    }
  }, [refreshToken])

  const contextValue = useMemo(() => ({
    token,
    setToken,
    artists,
    setArtists,
    playlists,
    setPlaylists,
    loading,
    setLoading,
    error,
    setError,
    refreshAccessToken
  }), [token, artists, playlists, loading, error, refreshAccessToken])

  return {
    contextValue,
    setToken,
    setRefreshToken
  }
}

export function authenticateSpotify() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!
  const redirectUri = `${window.location.origin}/callback`
  const scope = 'user-read-private user-read-email playlist-read-private user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing'
  const state = Math.random().toString(36).substring(2, 15)

  const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&state=${state}`

  localStorage.setItem('spotify_auth_state', state)
  window.location.href = authUrl
}

export default function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const { contextValue, setToken, setRefreshToken } = useSpotifyValue()

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_token')
    const storedRefreshToken = localStorage.getItem('spotify_refresh_token')
    
    if (storedToken) {
      setToken(storedToken)
      initSpotify(storedToken)
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken)
    }

    const handleTokenFromHash = () => {
      const hash = window.location.hash
      if (!hash) return

      const params = new URLSearchParams(hash.slice(1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      
      if (accessToken) {
        setToken(accessToken)
        initSpotify(accessToken)
        localStorage.setItem('spotify_token', accessToken)
        window.location.hash = ''
      }
      if (refreshToken) {
        setRefreshToken(refreshToken)
        localStorage.setItem('spotify_refresh_token', refreshToken)
      }
    }

    handleTokenFromHash()
  }, [setToken, setRefreshToken])

  useEffect(() => {
    const interval = setInterval(() => {
      contextValue.refreshAccessToken()
    }, 3600 * 1000)
    return () => clearInterval(interval)
  }, [contextValue])

  return (
    <SpotifyContext.Provider value={contextValue}>
      {children}
    </SpotifyContext.Provider>
  )
}
