import type { Metadata } from 'next'
import './globals.css'
import SpotifyProvider from './spotify-provider'

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'Listen to your favorite music on Spotify Clone',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='antialiased bg-zinc-900 text-zinc-50 w-full h-full min-h-screen min-w-full'>
        <SpotifyProvider>
          {children}
        </SpotifyProvider>
      </body>
    </html>
  )
}
