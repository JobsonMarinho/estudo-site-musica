import { Sidebar } from 'lucide-react'
import Footer from '../components/footer'
import FavoritesContent from '../components/favorites-content'

export default function FavoritesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 w-full">
        <Sidebar />
        <FavoritesContent />
      </div>
      <Footer />
    </div>
  )
}
