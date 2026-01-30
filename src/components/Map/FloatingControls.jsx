import { FaSearch, FaCrosshairs, FaHome, FaPlus, FaMinus, FaCompass } from 'react-icons/fa'
import { useUI } from '../../context/UIContext'
import { useMap } from '../../context/MapContext'

const FloatingControls = () => {
  const { openPOIRequestModal } = useUI()
  const { 
    getUserLocation, 
    resetToDefault 
  } = useMap()

  const goToUserLocation = async () => {
    await getUserLocation()
  }

  return (
    <div className="fixed top-20 right-4 z-30 flex flex-col space-y-3">
      {/* Search Bar */}
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 p-3">
        <div className="flex items-center">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search venues..."
            className="bg-transparent border-0 text-white focus:outline-none placeholder-gray-400 w-48"
          />
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <button className="block w-12 h-12 text-white hover:bg-gray-700 transition-colors border-b border-gray-700">
          <FaPlus className="mx-auto" />
        </button>
        <button className="block w-12 h-12 text-white hover:bg-gray-700 transition-colors">
          <FaMinus className="mx-auto" />
        </button>
      </div>

      {/* Location Controls */}
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <button
          onClick={goToUserLocation}
          className="block w-12 h-12 text-white hover:bg-gray-700 transition-colors border-b border-gray-700"
        >
          <FaCrosshairs className="mx-auto" />
        </button>
        <button
          onClick={resetToDefault}
          className="block w-12 h-12 text-white hover:bg-gray-700 transition-colors"
        >
          <FaHome className="mx-auto" />
        </button>
      </div>

      {/* Add POI Button */}
      <button
        onClick={openPOIRequestModal}
        className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-xl hover:opacity-90 transition-opacity flex items-center justify-center"
      >
        <FaPlus />
      </button>
    </div>
  )
}

export default FloatingControls