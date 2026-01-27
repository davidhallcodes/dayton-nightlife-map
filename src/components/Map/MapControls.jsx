import { useMap } from 'react-leaflet'
import { FaSearch, FaCrosshairs, FaHome, FaPlus, FaMinus, FaCompass } from 'react-icons/fa'
import { useUI } from '../../context/UIContext'
import { useMap as useMapContext } from '../../context/MapContext'
import { useState } from 'react'

const MapControls = () => {
  const map = useMap()
  const { openPOIRequestModal } = useUI()
  const { 
    searchQuery, 
    setSearchQuery, 
    getUserLocation, 
    resetToDefault,
    northOrientation 
  } = useMapContext()
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement geocoding here (using Nominatim or similar)
      console.log('Searching for:', searchQuery)
    }
  }

  const zoomIn = () => map.zoomIn()
  const zoomOut = () => map.zoomOut()
  const resetNorth = () => map.setBearing(0)

  const goToUserLocation = async () => {
    const location = await getUserLocation()
    if (location) {
      map.flyTo([location.lat, location.lng], 16)
    }
  }

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar !bg-transparent !border-none space-y-2">
        {/* Search Control */}
        <div className="relative">
          <div className={`bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl transition-all duration-300 ${isSearchExpanded ? 'w-64' : 'w-12'}`}>
            <form onSubmit={handleSearch} className="flex items-center">
              {isSearchExpanded && (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Dayton nightlife..."
                  className="flex-1 bg-transparent border-0 text-white px-4 py-2 focus:outline-none placeholder-gray-400"
                  autoFocus
                />
              )}
              <button
                type="button"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="p-3 text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaSearch />
              </button>
            </form>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
          <button
            onClick={zoomIn}
            className="block w-12 h-12 text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
            title="Zoom in"
          >
            <FaPlus className="mx-auto" />
          </button>
          <button
            onClick={zoomOut}
            className="block w-12 h-12 text-white hover:bg-gray-700 transition-colors"
            title="Zoom out"
          >
            <FaMinus className="mx-auto" />
          </button>
        </div>

        {/* Location Controls */}
        <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
          <button
            onClick={goToUserLocation}
            className="block w-12 h-12 text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
            title="Go to my location"
          >
            <FaCrosshairs className="mx-auto" />
          </button>
          <button
            onClick={resetToDefault}
            className="block w-12 h-12 text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
            title="Reset to Dayton"
          >
            <FaHome className="mx-auto" />
          </button>
          {northOrientation !== 0 && (
            <button
              onClick={resetNorth}
              className="block w-12 h-12 text-white hover:bg-gray-700 transition-colors"
              title="Reset north orientation"
            >
              <FaCompass className="mx-auto" />
            </button>
          )}
        </div>

        {/* Add POI Button (only shows when logged in) */}
        <button
          onClick={openPOIRequestModal}
          className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-xl hover:opacity-90 transition-opacity flex items-center justify-center"
          title="Submit new venue"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  )
}

export default MapControls