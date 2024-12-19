import { useCallback, useEffect, useState } from 'react'
import { getCurrentUserCurrentlyPlayingTrack } from '../services/spotify-api'
import { getUserPlaybackInformation, type Episode, type Track } from 'spotify-web-sdk'

export interface PlaybackState {
  isPlaying: boolean
  repeatState: 'off' | 'context' | 'track' | string
  shuffleState: boolean
  duration: number
  progressMs: number
  volume: number
  track: Track | Episode | null
  actions: boolean
}

const initialState: PlaybackState = {
  isPlaying: false,
  repeatState: 'off',
  shuffleState: false,
  duration: 0,
  progressMs: 0,
  volume: 50,
  track: null,
  actions: false,
}

let subscribers: ((state: PlaybackState) => void)[] = []
let currentState = initialState
let updateInterval: NodeJS.Timeout | null = null

const notifySubscribers = () => {
  subscribers.forEach(callback => callback(currentState))
}

export const usePlaybackState = () => {
  const [state, setState] = useState<PlaybackState>(currentState)

  const updatePlaybackState = useCallback(async () => {
    try {
      const data = await getCurrentUserCurrentlyPlayingTrack()
      const playbackState = await getUserPlaybackInformation()
      if (!data || !playbackState) return

      currentState = {
        isPlaying: playbackState.isPlaying ?? false,
        repeatState: playbackState.repeatState ?? 'off',
        shuffleState: playbackState.shuffleState ?? false,
        volume: playbackState.device?.volumePercent ?? 50,
        duration: data.item?.durationMs ?? 0,
        progressMs: data.progressMs ?? 0,
        track: data.item ?? null,
        actions: data.actions ?? false,
      }

      notifySubscribers()
    } catch (error) {
      console.error('Failed to update playback state:', error)
    }
  }, [])

  useEffect(() => {
    // Add subscriber
    subscribers.push(setState)

    // Start interval if it's not already running
    if (!updateInterval) {
      updatePlaybackState() // Initial update
      updateInterval = setInterval(updatePlaybackState, 1000)
    }

    // Cleanup
    return () => {
      subscribers = subscribers.filter(sub => sub !== setState)
      if (subscribers.length === 0 && updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
    }
  }, [updatePlaybackState])

  return state
}
