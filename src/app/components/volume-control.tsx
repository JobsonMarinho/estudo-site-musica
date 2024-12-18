'use client'

import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { SpotifyContext } from '../spotify-provider'
import { getUserPlaybackInformation, setVolumeForUserPlayback } from '../services/spotify-api'

export default function VolumeControl() {
  const { token } = useContext(SpotifyContext)
  const [volume, setVolume] = useState(100)
  const [oldVolume, setOldVolume] = useState(100)

  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        getUserPlaybackInformation().then((data) => {
          setVolume(data.device.volumePercent)
          setOldVolume(data.device.volumePercent)
        })
      }, 10_000)
      return () => clearInterval(interval)
    }
  }, [token])

  const handleVolumeButton = () => {
    if (volume <= 0) {
      setVolume(oldVolume)
      setVolumeForUserPlayback(oldVolume)
    } else {
      setOldVolume(volume)
      setVolume(0)
      setVolumeForUserPlayback(0)
    }
  }

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value))
    setVolumeForUserPlayback(Number(e.target.value))
  }

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} className='text-zinc-200' />
    if (volume <= 33) return <Volume size={20} className='text-zinc-200' />
    if (volume <= 66) return <Volume1 size={20} className='text-zinc-200' />
    return <Volume2 size={20} className='text-zinc-200' />
  }

  return (
    <div className='flex items-center gap-2'>
      <button onClick={handleVolumeButton}>
        {getVolumeIcon()}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className='w-24 h-1 rounded-full'
      />
    </div>
  )
}