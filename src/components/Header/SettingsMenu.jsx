import { FaMapMarkerAlt, FaFilter, FaCompass, FaSearch } from 'react-icons/fa'
import { useMap } from '../../context/MapContext'
import { useUI } from '../../context/UIContext'

const SettingsMenu = () => {
  const { resetToUserLocation, resetToDefault, northOrientation, setNorthOrientation } = useMap()
  const { toggleFilterMenu } = useUI()

  return (
    <div className="absolute right-2 top-16 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-slide-down z-50">
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-3 text-white">Map Settings</h3>
        
        <div className="space-y-3">
          <button
            onClick={resetToUserLocation}
            className="flex items-center w-full p-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
          >
            <FaMapMarkerAlt className="mr-3 text-blue-400" />
            <div>
              <div className="font-medium text-white">Go to My Location</div>
              <div className="text-sm text-gray-400">Center map on your position</div>
            </div>
          </button>
          
          <button
            onClick={resetToDefault}
            className="flex items-center w-full p-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
          >
            <FaMapMarkerAlt className="mr-3 text-purple-400" />
            <div>
              <div className="font-medium text-white">Reset to Dayton</div>
              <div className="text-sm text-gray-400">Center map on downtown</div>
            </div>
          </button>
          
          <button
            onClick={toggleFilterMenu}
            className="flex items-center w-full p-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
          >
            <FaFilter className="mr-3 text-green-400" />
            <div>
              <div className="font-medium text-white">Toggle Filters</div>
              <div className="text-sm text-gray-400">Show/hide category filter</div>
            </div>
          </button>
          
          <div className="pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FaCompass className="mr-3 text-yellow-400" />
                <span className="font-medium text-white">North Orientation</span>
              </div>
              <span className="text-gray-400">{northOrientation}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={northOrientation}
              onChange={(e) => setNorthOrientation(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsMenu