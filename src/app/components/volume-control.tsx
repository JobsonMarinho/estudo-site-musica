'use client'

import { Volume1, Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { setVolumeForUserPlayback } from '../services/spotify-api'
import AnimatedIcon from './animated-icon'
import { usePlaybackState } from '../hooks/usePlaybackState'

interface VolumeControlProps {
  disabled?: boolean
}

export default function VolumeControl({ disabled }: VolumeControlProps) {
  const { volume } = usePlaybackState()
  const [localVolume, setLocalVolume] = useState(volume)
  const [previousVolume, setPreviousVolume] = useState(volume)

  useEffect(() => {
    setLocalVolume(volume)
    setPreviousVolume(volume)
  }, [volume])

  const handleVolumeChange = useCallback(async (value: number) => {
    setLocalVolume(value)
    try {
      await setVolumeForUserPlayback(value)
    } catch (error) {
      console.error('Failed to set volume:', error)
    }
  }, [])

  const toggleMute = useCallback(async () => {
    if (localVolume === 0) {
      await handleVolumeChange(previousVolume)
    } else {
      setPreviousVolume(localVolume)
      await handleVolumeChange(0)
    }
  }, [localVolume, previousVolume, handleVolumeChange])

  const VolumeIcon = useCallback(() => {
    if (localVolume === 0) return VolumeX
    if (localVolume < 50) return Volume1
    return Volume2
  }, [localVolume])

  return (
    <div className='flex items-center gap-2'>
      <button onClick={toggleMute} disabled={disabled}>
        <AnimatedIcon
          disabled={disabled}
          IconComponent={VolumeIcon()}
          size={20}
          className='text-zinc-200'
        />
      </button>
      <input
        type='range'
        min={0}
        max={100}
        value={localVolume}
        disabled={disabled}
        onChange={(e) => handleVolumeChange(Number(e.target.value))}
        className='w-24 h-1 bg-zinc-600 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white'
      />
    </div>
  )
}