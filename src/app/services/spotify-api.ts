import type { Artist } from 'spotify-web-sdk'
import * as spotify from 'spotify-web-sdk'

export const initSpotify = (token: string) => {
  spotify.init({ token })
}

export const getUserAvailableDevices = async () => {
    return await spotify.getUserAvailableDevices()
}

export const playPlaylist = async (token: string,artist: Artist) => {
    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context_uri: artist.uri,
      }),
    }).then(async (response) => {
      if (response.status === 404) {
        const devices = await getUserAvailableDevices()
        if (devices) {
          const device = devices[0]
          const deviceId = device.id
          fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              context_uri: artist.uri,
              device_id: deviceId,
            }),
          }).then(() => {
            alert(`Playing playlist on ${device.name}`)
            resumeUserPlayback(deviceId)
          })
        } else {
          alert('No devices available')
        }
      }
    })
  }

export const getCurrentUserCurrentlyPlayingTrack = async () => {
  return await spotify.getCurrentUserCurrentlyPlayingTrack()
}

export const getUserPlaybackInformation = async () => {
  return await spotify.getUserPlaybackInformation()
}

export const setVolumeForUserPlayback = async (volume: number) => {
  return await spotify.setVolumeForUserPlayback(volume)
}

export const pauseUserPlayback = async () => {
  return await spotify.pauseUserPlayback()
}

export const resumeUserPlayback = async (deviceId?: string) => {
  return await spotify.resumeUserPlayback({ deviceId })
}

export const skipUserPlaybackToPreviousTrack = async () => {
  return await spotify.skipUserPlaybackToPreviousTrack()
}

export const skipUserPlaybackToNextTrack = async () => {
  return await spotify.skipUserPlaybackToNextTrack()
}

export const setRepeatModeOnUserPlayback = async (mode: 'off' | 'context' | 'track') => {
  return await spotify.setRepeatModeOnUserPlayback(mode)
}

export const fetchUserProfile = async () => {
  return await spotify.getCurrentUserProfile()
}

export const fetchPlaylists = async (limit: number, offset: number = 0) => {
  return await spotify.getCurrentUserPlaylists({ limit, offset })
}

export const fetchFavoritesArtists = async (offset: number = 0) => {
  return await spotify.getCurrentUserTopArtists({ limit: 18, offset: offset })
}