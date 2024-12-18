import { useContext } from 'react'
import { SpotifyContext } from '../spotify-provider'

export default function useSpotify() {
  return useContext(SpotifyContext)
}