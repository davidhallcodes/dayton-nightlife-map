import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MapProvider } from './context/MapContext'
import { UIProvider } from './context/UIContext'
import Header from './components/Header/Header'
import MapContainer from './components/Map/MapContainer'
import CategoryFilter from './components/Filters/CategoryFilter'
import Directions from './components/Map/MapDirections'
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
      <Header />
      <main className="flex-1 relative">
        <MapContainer />
        <CategoryFilter />
        <Directions />
      </main>
      <Footer />
      
      {/* Modals */}
      {isLoginModalOpen && <LoginModal />}
      {isPOIRequestModalOpen && <POIRequestModal />}
      {isProfileModalOpen && <ProfileModal />}
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