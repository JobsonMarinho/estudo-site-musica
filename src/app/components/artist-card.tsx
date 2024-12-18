import type { Artist } from 'spotify-web-sdk'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface ArtistCardProps {
  artist: Artist;
  onPlay: () => void;
}

export default function ArtistCard({ artist, onPlay }: ArtistCardProps) {
  return (
    <div
      onClick={onPlay}
      className="group bg-white/5 rounded flex items-center gap-4 overflow-hidden hover:bg-white/10 transition-colors"
    >
      {artist.images[0] && artist.images[0].url ? (
        <Image src={artist.images[0]?.url} alt={artist.name} height={300} width={300} className="w-24 h-24 object-cover" />
      ) : (
        <div className="w-24 h-24 bg-gray-300" />
      )}
      <div className="hidden lg:flex items-center gap-4 justify-between flex-1">
        <strong>{artist.name}</strong>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-400 w-12 h-12 flex items-center justify-center rounded-full bg-green-500 ml-auto mr-8">
          <Play className="text-black fill-current" />
        </button>
      </div>
    </div>
  )
}