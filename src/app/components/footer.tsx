'use client'

import { useContext } from 'react'
import { usePlaybackState } from '../hooks/usePlaybackState'
import { SpotifyContext } from '../spotify-provider'
import PlayerControl from './player-control'
import VolumeControl from './volume-control'
import Image from 'next/image'

export default function Footer() {
  const { track } = usePlaybackState()
  const { token } = useContext(SpotifyContext)

  return (
    <footer className='fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-zinc-800 p-3'>
      <div className='flex items-center justify-between'>
        {track ? (
          <div className='flex items-center gap-3'>
            {'album' in track && (
              <Image
                src={track.album?.images[0]?.url ?? ''}
                width={56}
                height={56}
                alt={track.name ?? ''}
                className='rounded'
              />
            )}
            <div className='flex flex-col gap-1'>
              <strong className='font-normal text-sm'>{track.name}</strong>
              {'artists' in track && (
                <span className='text-xs text-zinc-400'>{track.artists?.map(artist => artist.name).join(', ')}</span>
              )}
            </div>
          </div>
        ) : (
          <div className='w-[200px]' />
        )}

        <PlayerControl disabled={!token || !track} />
        <VolumeControl disabled={!token || !track} />
      </div>
    </footer>
  )
}