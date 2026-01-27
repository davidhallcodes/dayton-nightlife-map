import { useEffect, useState } from 'react'
import { FaDirections, FaExternalLinkAlt, FaCar, FaWalking, FaBicycle } from 'react-icons/fa'
import { useMap } from '../../context/MapContext'
import { useAuth } from '../../context/AuthContext'

const Directions = () => {
  const { selectedPOI, userLocation } = useMap()
  const { user } = useAuth()
  const [travelMode, setTravelMode] = useState('driving')
  const [showDirections, setShowDirections] = useState(false)

  useEffect(() => {
    if (selectedPOI) {
      setShowDirections(true)
    }
  }, [selectedPOI])

  if (!showDirections || !selectedPOI) return null

  const getDirectionsUrl = () => {
    const origin = userLocation 
      ? `${userLocation.lat},${userLocation.lng}`
      : 'Dayton, OH'
    
    const destination = `${selectedPOI.latitude},${selectedPOI.longitude}`
    
    switch(travelMode) {
      case 'walking':
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`
      case 'bicycling':
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=bicycling`
      case 'transit':
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=transit`
      default: // driving
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
    }
  }

  const openDirections = () => {
    const url = getDirectionsUrl()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const formatDistance = (meters) => {
    if (meters < 1000) return `${Math.round(meters)}m`
    return `${(meters / 1000).toFixed(1)}km`
  }

  const calculateDistance = () => {
    if (!userLocation || !selectedPOI) return null
    
    const R = 6371e3 // Earth's radius in meters
    const φ1 = userLocation.lat * Math.PI/180
    const φ2 = selectedPOI.latitude * Math.PI/180
    const Δφ = (selectedPOI.latitude - userLocation.lat) * Math.PI/180
    const Δλ = (selectedPOI.longitude - userLocation.lng) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // Distance in meters
  }

  const distance = calculateDistance()

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar !bg-transparent !border-none mr-4 mb-20">
        <div className="bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 w-80 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaDirections className="text-blue-400 mr-2" />
              <h3 className="font-bold text-white">Get Directions</h3>
            </div>
            <button
              onClick={() => setShowDirections(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          {userLocation && distance && (
            <div className="mb-4 p-3 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-300">Distance from you:</div>
              <div className="text-xl font-bold text-white">{formatDistance(distance)}</div>
            </div>
          )}

          <div className="mb-4">
            <div className="text-sm text-gray-300 mb-2">Travel Mode:</div>
            <div className="flex space-x-2">
              {['driving', 'walking', 'bicycling', 'transit'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTravelMode(mode)}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    travelMode === mode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {mode === 'driving' && <FaCar />}
                  {mode === 'walking' && <FaWalking />}
                  {mode === 'bicycling' && <FaBicycle />}
                  {mode === 'transit' && <FaDirections />}
                  <span className="capitalize">{mode}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {!user && (
              <div className="text-amber-400 text-sm p-2 bg-amber-900 bg-opacity-20 rounded">
                Sign in to save favorite routes
              </div>
            )}

            <button
              onClick={openDirections}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              <FaExternalLinkAlt className="mr-2" />
              Open in Google Maps
            </button>

            <p className="text-xs text-gray-400 text-center">
              Directions will open in a new window
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Directions