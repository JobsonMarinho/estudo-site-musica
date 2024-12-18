import { authenticateSpotify } from '../spotify-provider'

export default function LoginButton() {
  return (
    <button
      onClick={authenticateSpotify}
      className="px-4 py-2 bg-green-500 text-white rounded-lg"
    >
      Login com Spotify
    </button>
  )
}
