import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MapProvider } from './context/MapContext'
import { UIProvider } from './context/UIContext'
import Header from './components/Header/Header'
import MapContainer from './components/Map/MapContainer'
import CategoryFilter from './components/Filters/CategoryFilter'
import Directions from './components/Map/Directions'
import LoginModal from './components/Modals/LoginModal'
import POIRequestModal from './components/Modals/POIRequestModal'
import ProfileModal from './components/Modals/ProfileModal'
import Footer from './components/Footer/Footer'
import { useUI } from './context/UIContext'

function AppContent() {
  const { 
    isLoginModalOpen, 
    isPOIRequestModalOpen, 
    isProfileModalOpen 
  } = useUI()

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      {/* Header - Top Layer (Highest z-index) */}
      <div className="relative z-50">
        <Header />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 relative">
        {/* Map - Base Layer (Lowest z-index) */}
        <div className="absolute inset-0 z-0">
          <MapContainer />
        </div>
        
        {/* UI Components - Middle Layers */}
        <div className="relative z-10">
          <CategoryFilter />
          <Directions />
        </div>
      </main>
      
      {/* Footer - Top Layer */}
      <div className="relative z-40">
        <Footer />
      </div>
      
      {/* Modals - Highest Layer (Above everything) */}
      <div className="relative z-60">
        {isLoginModalOpen && <LoginModal />}
        {isPOIRequestModalOpen && <POIRequestModal />}
        {isProfileModalOpen && <ProfileModal />}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <MapProvider>
            <AppContent />
          </MapProvider>
        </UIProvider>
      </AuthProvider>
    </Router>
  )
}

export default App