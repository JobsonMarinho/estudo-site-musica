'use client'

import { useEffect } from 'react'
import UserCard from './user-card'
import LoginButton from './login-button'
import SignOutButton from './signout-button'
import useSpotify from '../hooks/useSpotify'
import { fetchFavoritesArtists, playPlaylist } from '../services/spotify-api'
import ArtistCard from './artist-card'

export default function MainContent() {
  const { token, artists, loading, error, setArtists } = useSpotify()

  useEffect(() => {
    if (token && !artists) {
      fetchFavoritesArtists().then(artists => {
        setArtists(artists.items)
      })
    }
  }, [token, artists, setArtists])

  if (!token) return (
    <div className='items-center justify-center flex w-full flex-col gap-2'>
      <span>Para ver seus artistas favoritos, faça login com o Spotify</span>
      <LoginButton />
    </div>
  )

  if (loading) return (
    <main className="flex-1 min-w-fit w-fit p-6">
      <UserCard />
      <div className="flex items-center justify-center h-full">
        <p>Carregando...</p>
      </div>
    </main>
  )

  if (error) return (
    <main className="flex-1 min-w-fit w-fit p-6">
      <UserCard />
      <div className="flex items-center justify-center h-full">
        <div className='flex flex-col items-center gap-4'>
          <p>Erro ao carregar seus artistas favoritos</p>
          <SignOutButton />
        </div>
      </div>
    </main>
  )

  return (
    <main className="flex-1 min-w-fit w-fit p-6">
      <UserCard />

      <h1 className="font-semibold text-3xl mt-10">Good Afternoon</h1>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {artists?.map((artist, index) => (
          <ArtistCard key={index} artist={artist} onPlay={() => playPlaylist(token, artist)} />
        ))}
      </div>
    </main>
  )
}