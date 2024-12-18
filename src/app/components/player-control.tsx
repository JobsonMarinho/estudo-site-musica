'use client'

import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { SpotifyContext } from '../spotify-provider'
import { getCurrentUserCurrentlyPlayingTrack, pauseUserPlayback, resumeUserPlayback, skipUserPlaybackToPreviousTrack, skipUserPlaybackToNextTrack, setRepeatModeOnUserPlayback } from '../services/spotify-api'
import AnimatedIcon from './animated-icon'

interface PlayerControlProps {
  disabled: boolean;
}

export default function PlayerControl({ disabled }: PlayerControlProps) {
  const { token } = useContext(SpotifyContext)
  const [isPlaying, setIsPlaying] = useState(false)
  const [repeatState, setRepeatState] = useState('off')
  const [duration, setDuration] = useState(0)
  const [progressMs, setProgressMs] = useState(0)

  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        getCurrentUserCurrentlyPlayingTrack().then((data) => {
          setIsPlaying(data?.actions ?? false)
          setProgressMs(data.progressMs ?? 0)
          setDuration(data.item?.durationMs ?? 0)
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [token])

  const getIcon = () => {
    return isPlaying ? <AnimatedIcon disabled={disabled} IconComponent={Pause} size={20} className='text-black fill-current' /> : <AnimatedIcon IconComponent={Play} size={20} className='text-black fill-current' />
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseUserPlayback()
      setIsPlaying(false)
    } else {
      resumeUserPlayback()
      setIsPlaying(true)
    }
  }

  const getRepeatIcon = () => {
    if (repeatState === 'off') {
      return <AnimatedIcon disabled={disabled} IconComponent={Repeat} size={18} className='text-zinc-300' />
    } else if (repeatState === 'context') {
      return (
        <div className="relative group">
          <AnimatedIcon disabled={disabled} IconComponent={Repeat} size={18} className='text-green-500' />
          <div className="absolute -bottom-2 right-[0.55rem] transform translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-green-500 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
        </div>
      )
    } else if (repeatState === 'track') {
      return (
        <div className="relative group">
          <AnimatedIcon disabled={disabled} IconComponent={Repeat1} size={18} className='text-green-500' />
          <div className="absolute -bottom-2 right-[0.55rem] transform translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-green-500 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
        </div>
      )
    }
  }

  const handleRepeat = () => {
    if (repeatState === 'off') {
      setRepeatModeOnUserPlayback('context')
      setRepeatState('context')
    } else if (repeatState === 'context') {
      setRepeatModeOnUserPlayback('track')
      setRepeatState('track')
    } else if (repeatState === 'track') {
      setRepeatModeOnUserPlayback('off')
      setRepeatState('off')
    }
  }

  const handlePrevious = () => {
    skipUserPlaybackToPreviousTrack()
  }

  const handleNext = () => {
    skipUserPlaybackToNextTrack()
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='flex items-center gap-6'>
        <AnimatedIcon disabled={disabled} IconComponent={Shuffle} size={18} className='text-zinc-300' />
        <AnimatedIcon disabled={disabled} onClick={handlePrevious} IconComponent={SkipBack} size={20} className='text-zinc-300 fill-current' />
        <button onClick={handlePlayPause} className='w-9 h-9 flex items-center justify-center rounded-full bg-white hover:scale-110 transition-transform duration-300'>
          {getIcon()}
        </button>
        <AnimatedIcon disabled={disabled} onClick={handleNext} IconComponent={SkipForward} size={20} className='text-zinc-300 fill-current' />
        <button onClick={handleRepeat}>
          {getRepeatIcon()}
        </button>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-xs text-zinc-400'>{convertMsToTime(progressMs ?? 0)}</span>
        <div className='w-72 h-1 bg-zinc-700 rounded-full'>
          {!disabled && (
            <div className='bg-zinc-200 h-full rounded-full' style={{ width: `${(progressMs / duration) * 100}%` }}></div>
          )}
        </div>
        <span className='text-xs text-zinc-400'>{convertMsToTime(duration ?? 0)}</span>
      </div>
    </div>
  )
}

function convertMsToTime(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}