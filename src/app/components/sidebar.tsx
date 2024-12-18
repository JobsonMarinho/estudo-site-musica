'use client'

import { Home, Search, Library, Heart } from 'lucide-react'
import Image from 'next/image'
import useSpotify from '../hooks/useSpotify'
import { useEffect } from 'react'
import { fetchPlaylists } from '../services/spotify-api'

export default function Sidebar() {
  const { token, playlists, setPlaylists, loading, error } = useSpotify()

  useEffect(() => {
    if (token && !playlists) {
      fetchPlaylists(20, 0).then((playlists) => {
        setPlaylists(playlists.items)
      })
    }
  }, [token, playlists, setPlaylists])

  if (!token) return

  if (loading) return

  if (error) return

  return (
    <aside className="w-72 min-w-72 bg-zinc-950 py-2 px-4">
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 rounded-full bg-red-500'></div>
        <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
        <div className='w-3 h-3 rounded-full bg-green-500'></div>
      </div>

      <nav className='flex flex-col gap-4 mt-10'>
        <a href="" className='flex items-center gap-3 text-sm font-semibold text-zinc-200'>
          <Home />
          <span>Início</span>
        </a>
        <a href="" className='flex items-center gap-3 text-sm font-semibold text-zinc-200'>
          <Search />
          <span>Buscar</span>
        </a>
        <a href="" className='flex items-center gap-3 text-sm font-semibold text-zinc-200'>
          <Library />
          <span>Sua Biblioteca</span>
        </a>
      </nav>

      <nav className='h-[700px] mt-5 pt-5 border-t border-zinc-800 flex flex-col gap-2 whitespace-nowrap overflow-y-auto overflow-x-hidden'>
        <a href="/favorites" className='flex items-center gap-3 text-sm font-semibold text-zinc-300'>
          <div className='w-9 h-9 flex items-center justify-center bg-gradient-to-br from-[#460af4] via-[#847ce6] to-[#bce5d3]'>
            <Heart className='text-zinc-300 opacity-80 fill-current h-4 w-10' />
          </div>
          <span>Músicas Curtidas</span>
        </a>
        {playlists?.map((playlist, index) => (
          <div key={index} className='text-sm text-zinc-400 hover:text-zinc-100 flex items-center gap-3'>
            {playlist.images && playlist.images[0] && playlist.images[0].url ? (
              <Image
                className='rounded-sm object-cover w-9 h-9'
                src={playlist.images[0]?.url}
                alt={playlist.name}
                width={64}
                height={64}
              />
            ) : (
              <div className='w-4 h-4 bg-gray-300 rounded-sm' />
            )}
            <a href="#">{playlist.name}</a>
          </div>
        ))}
      </nav>
    </aside>
  )
}