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

  const handleSearch = async (e) => {
  e.preventDefault()
  if (!searchQuery.trim()) return

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
    )
    const data = await res.json()

    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0]
      map.flyTo([parseFloat(lat), parseFloat(lon)], 15)
      console.log('Found location:', display_name)
    } else {
      alert('Location not found')
    }
  } catch (err) {
    console.error('Search failed:', err)
    alert('Search error')
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
    <div className="fixed top-20 right-4 z-[9999] flex items-center gap-2 pointer-events-none">
      <button
        type="button"
        onClick={() => setIsSearchExpanded(!isSearchExpanded)}
        className="w-12 h-12 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl text-white hover:bg-gray-700 transition-colors flex items-center justify-center pointer-events-auto"
        title="Search venues"
      >
        <FaSearch />
      </button>

      {isSearchExpanded && (
  <form
    onSubmit={handleSearch}
    className="flex items-center bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden pointer-events-auto"
  >
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search location..."
      className="px-3 py-2 w-56 bg-transparent text-white placeholder-gray-400 focus:outline-none"
    />
    <button
      type="submit"
      className="w-12 h-12 flex items-center justify-center text-white hover:bg-gray-700"
    >
      <FaSearch />
    </button>
  </form>
)}

      <div className="flex bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden pointer-events-auto">
        <button
          onClick={zoomIn}
          className="inline-flex items-center justify-center w-12 h-12 text-white hover:bg-gray-700 transition-colors border-r border-gray-700"
          title="Zoom in"
        >
          <FaPlus />
        </button>
        <button
          onClick={zoomOut}
          className="inline-flex items-center justify-center w-12 h-12 text-white hover:bg-gray-700 transition-colors border-r border-gray-700"
          title="Zoom out"
        >
          <FaMinus />
        </button>
        <button
          onClick={goToUserLocation}
          className="inline-flex items-center justify-center w-12 h-12 text-white hover:bg-gray-700 transition-colors border-r border-gray-700"
          title="Go to my location"
        >
          <FaCrosshairs />
        </button>
        {northOrientation !== 0 && (
          <button
            onClick={resetNorth}
            className="inline-flex items-center justify-center w-12 h-12 text-white hover:bg-gray-700 transition-colors"
            title="Reset north orientation"
          >
            <FaCompass />
          </button>
        )}
      </div>

      <button
        onClick={openPOIRequestModal}
        className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-xl hover:opacity-90 transition-opacity flex items-center justify-center pointer-events-auto"
        title="Submit new venue"
      >
        <FaPlus />
      </button>
    </div>
  )
}

export default MapControls