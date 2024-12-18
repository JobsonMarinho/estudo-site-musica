export default function SignOutButton() {
  return (
    <button
      className='block w-full p-2 text-center hover:bg-black/60'
      onClick={() => {
        localStorage.removeItem('spotify_token')
        window.location.reload()
      }}
    >
      Sign out
    </button>
  )
}