import Image from 'next/image'
import type { Episode, Track } from 'spotify-web-sdk'

interface PlaybackItemProps {
  item: Track | Episode;
}

export default function PlaybackItem({ item }: PlaybackItemProps) {
  return (
    <div className='flex items-center gap-3'>
      <div className="w-14 h-14 bg-gray-300 rounded text-sm flex items-center justify-center text-center">
        {item && 'album' in item && item.album.images && (
          <Image
            src={item.album.images[0].url}
            alt={item.album.name}
            width={56}
            height={56}
            className='w-14 h-14 rounded'
          />
        )}
      </div>
      <div className='flex flex-col'>
        <strong className='font-normal'>{item?.name}</strong>
        <span className='text-xs text-zinc-400'>
          {item && 'artists' in item ? item.artists.map(artist => artist.name).join(', ') : item && 'show' in item ? item.show.name : ''}
        </span>
      </div>
    </div>
  )
}