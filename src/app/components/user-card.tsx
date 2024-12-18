'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import SignOutButton from './signout-button'
import type { PrivateUser } from 'spotify-web-sdk'
import useSpotify from '../hooks/useSpotify'
import { fetchUserProfile } from '../services/spotify-api'

export default function UserCard() {
  const { token, error, loading, setLoading, setError } = useSpotify()
  const [userData, setUserData] = useState<PrivateUser | null>(null)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchUserProfile()
        .then((data) => {
          setUserData(data)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [token, setLoading, setError])

  if (!token) return
  if (loading) return
  if (error) return

  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-4'>
        <button className='rounded-full bg-black/40 p-1'>
          <ChevronLeft />
        </button>
        <button className='rounded-full bg-black/40 p-1'>
          <ChevronRight />
        </button>
      </div>
      {userData && (
        <div ref={menuRef} className='flex items-center justify-between gap-2 rounded-full bg-black p-1'>
          <div className="w-8 h-8 bg-gray-300 text-xs flex items-center justify-center text-center rounded-full">
            {userData.images.length === 0 ?
              userData.displayName :
              <Image
                className='rounded-full'
                src={userData.images[0].url}
                width={32}
                height={32}
                alt="User Avatar"
              />}
          </div>
          <p className='text-sm font-semibold'>{userData.displayName}</p>
          <div onClick={() => setOpen(!open)} className="relative hover:cursor-pointer">
            <ChevronDown className='w-5 text-zinc-300 fill-current m-1' />
            <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500/80 rounded-full"></div>
          </div>
          <div className={`absolute top-16 right-6 bg-black/80 p-2 rounded-lg ${open ? 'block' : 'hidden'}`}>
            <button className='block w-full p-2 text-center hover:bg-black/60'>Profile</button>
            <button className='block w-full p-2 text-center hover:bg-black/60'>Account</button>
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  )
}