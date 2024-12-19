'use client'

import { useCallback, useMemo } from 'react'
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react'
import { pauseUserPlayback, resumeUserPlayback, skipUserPlaybackToPreviousTrack, skipUserPlaybackToNextTrack, setRepeatModeOnUserPlayback } from '../services/spotify-api'
import AnimatedIcon from './animated-icon'
import { usePlaybackState } from '../hooks/usePlaybackState'

interface PlayerControlProps {
  disabled: boolean;
}

export default function PlayerControl({ disabled }: PlayerControlProps) {
  const playbackState = usePlaybackState()

  const handlePlayPause = useCallback(async () => {
    try {
      if (playbackState.isPlaying) {
        await pauseUserPlayback()
      } else {
        await resumeUserPlayback()
      }
    } catch (error) {
      console.error('Failed to toggle playback:', error)
    }
  }, [playbackState.isPlaying])

  const handleRepeat = useCallback(async () => {
    const newState = playbackState.repeatState === 'off' ? 'context' 
      : playbackState.repeatState === 'context' ? 'track' 
      : 'off'
    
    try {
      await setRepeatModeOnUserPlayback(newState)
    } catch (error) {
      console.error('Failed to set repeat mode:', error)
    }
  }, [playbackState.repeatState])

  const handlePrevious = useCallback(async () => {
    try {
      await skipUserPlaybackToPreviousTrack()
    } catch (error) {
      console.error('Failed to skip to previous track:', error)
    }
  }, [])

  const handleNext = useCallback(async () => {
    try {
      await skipUserPlaybackToNextTrack()
    } catch (error) {
      console.error('Failed to skip to next track:', error)
    }
  }, [])

  const playPauseIcon = useMemo(() => (
    playbackState.isPlaying 
      ? <AnimatedIcon disabled={disabled} IconComponent={Pause} size={20} className='text-black fill-current' /> 
      : <AnimatedIcon IconComponent={Play} size={20} className='text-black fill-current' />
  ), [playbackState.isPlaying, disabled])

  const repeatIcon = useMemo(() => {
    if (playbackState.repeatState === 'off') {
      return <AnimatedIcon disabled={disabled} IconComponent={Repeat} size={18} className='text-zinc-300' />
    }
    
    const isTrackRepeat = playbackState.repeatState === 'track'
    return (
      <div className="relative group">
        <AnimatedIcon 
          disabled={disabled} 
          IconComponent={isTrackRepeat ? Repeat1 : Repeat} 
          size={18} 
          className='text-green-500' 
        />
        <div className="absolute -bottom-2 right-[0.55rem] transform translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-green-500 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
      </div>
    )
  }, [playbackState.repeatState, disabled])

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='flex items-center gap-6'>
        <AnimatedIcon disabled={disabled} IconComponent={Shuffle} size={18} className='text-zinc-300' />
        <AnimatedIcon 
          disabled={disabled} 
          onClick={handlePrevious} 
          IconComponent={SkipBack} 
          size={20} 
          className='text-zinc-300 fill-current' 
        />
        <button 
          onClick={handlePlayPause} 
          className='w-9 h-9 flex items-center justify-center rounded-full bg-white hover:scale-110 transition-transform duration-300'
        >
          {playPauseIcon}
        </button>
        <AnimatedIcon 
          disabled={disabled} 
          onClick={handleNext} 
          IconComponent={SkipForward} 
          size={20} 
          className='text-zinc-300 fill-current' 
        />
        <button onClick={handleRepeat}>
          {repeatIcon}
        </button>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-xs text-zinc-400'>{convertMsToTime(playbackState.progressMs)}</span>
        <div className='w-72 h-1 bg-zinc-700 rounded-full'>
          {!disabled && (
            <div 
              className='bg-zinc-200 h-full rounded-full' 
              style={{ width: `${(playbackState.progressMs / playbackState.duration) * 100}%` }}
            />
          )}
        </div>
        <span className='text-xs text-zinc-400'>{convertMsToTime(playbackState.duration)}</span>
      </div>
    </div>
  )
}

function convertMsToTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}