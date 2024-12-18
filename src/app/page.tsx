import MainContent from './components/content'
import Footer from './components/footer'
import Sidebar from './components/sidebar'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 w-full">
        <Sidebar />
        <MainContent />
      </div>
      <Footer />
    </div>
  )
}
