import type { Artist, Device, CurrentlyPlaying, CurrentlyPlayingContext, PrivateUser, PlaylistSimplified, Page } from 'spotify-web-sdk'
import * as spotify from 'spotify-web-sdk'

export const initSpotify: (token: string) => void = (token: string) => {
  spotify.init({ token })
}

export const isInitialized: () => boolean = () => {
  return spotify.getToken() !== null
}

export const getUserAvailableDevices: () => Promise<Device[]> = async () => {
  return await spotify.getUserAvailableDevices()
}

export const playPlaylist: (token: string, artist: Artist) => Promise<void> = async (token: string, artist: Artist) => {
  if (artist.uri) {
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        context_uri: artist.uri,
        position_ms: 0
      })
    }).then(async (response) => {
      if (response.status === 404) {
        const devices = await getUserAvailableDevices()
        if (devices && devices.length > 0) {
          const device = devices[0]
          if (!device) {
            alert('No devices available')
            return
          }
          const deviceId = device.id
          fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              device_id: deviceId,
              context_uri: artist.uri,
              position_ms: 0
            })
          })
        }
      }
    })
  }
}

export const getCurrentUserCurrentlyPlayingTrack: () => Promise<CurrentlyPlaying> = async () => {
  return await spotify.getCurrentUserCurrentlyPlayingTrack()
}

export const getUserPlaybackInformation: () => Promise<CurrentlyPlayingContext> = async () => {
  return await spotify.getUserPlaybackInformation()
}

export const setVolumeForUserPlayback: (volume: number) => Promise<string> = async (volume) => {
  return await spotify.setVolumeForUserPlayback(volume)
}

export const pauseUserPlayback: () => Promise<string> = async () => {
  return await spotify.pauseUserPlayback()
}

export const resumeUserPlayback: (deviceId?: string) => Promise<string> = async (deviceId) => {
  return await spotify.resumeUserPlayback({ deviceId })
}

export const skipUserPlaybackToPreviousTrack: () => Promise<string> = async () => {
  return await spotify.skipUserPlaybackToPreviousTrack()
}

export const skipUserPlaybackToNextTrack: () => Promise<string> = async () => {
  return await spotify.skipUserPlaybackToNextTrack()
}

export const setRepeatModeOnUserPlayback: (mode: 'off' | 'context' | 'track') => Promise<string> = async (mode) => {
  return await spotify.setRepeatModeOnUserPlayback(mode)
}

export const fetchUserProfile: () => Promise<PrivateUser> = async () => {
  return await spotify.getCurrentUserProfile()
}

export const fetchPlaylists: (limit: number, offset: number) => Promise<Page<PlaylistSimplified>> = async (limit, offset) => {
  return await spotify.getCurrentUserPlaylists({ limit, offset })
}

export const fetchFavoritesArtists: (offset: number) => Promise<Page<Artist>> = async (offset) => {
  return await spotify.getCurrentUserTopArtists({ limit: 18, offset: offset })
}