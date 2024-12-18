'use client'

import { useContext, useEffect, useState } from 'react'
import { Laptop2, LayoutList, Maximize2, Mic2 } from 'lucide-react'
import * as spotify from 'spotify-web-sdk'
import PlayerControl from './player-control'
import VolumeControl from './volume-control'
import { SpotifyContext } from '../spotify-provider'
import PlaybackItem from './playback-item'
import { cn } from '../utils/tailwind-merge'

export default function Footer() {
  const { token } = useContext(SpotifyContext)
  const [item, setItem] = useState<spotify.Track | spotify.Episode | null>(null)

  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        spotify.getCurrentUserCurrentlyPlayingTrack().then((data) => {
          if (data.item) {
            setItem(data.item)
          }
        })
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [token])

  if (!token) return null

  return (
    <footer className={cn('w-full min-w-full flex items-center bg-zinc-900 border-t border-zinc-700 p-4', {
      'justify-between': item,
      'justify-center': !item,
    })}>
      {item && <PlaybackItem item={item} />}
      <PlayerControl disabled={!item} />
      {item && (
        <div className='flex items-center gap-4'>
          <Mic2 size={20} className='text-zinc-200' />
          <LayoutList size={20} className='text-zinc-200' />
          <Laptop2 size={20} className='text-zinc-200' />
          <VolumeControl />
          <Maximize2 size={20} className='text-zinc-200' />
        </div>
      )}
    </footer>
  )
}