import { useState, useEffect } from 'react'
import { FaDirections, FaExternalLinkAlt, FaCar, FaWalking, FaBicycle, FaTimes } from 'react-icons/fa'
import { useMap } from '../../context/MapContext'
import { useAuth } from '../../context/AuthContext'
import mapHelpers from '../../utils/mapHelpers'

const Directions = () => {
  const { selectedPOI, userLocation, setSelectedPOI } = useMap()
  const { user } = useAuth()
  const [travelMode, setTravelMode] = useState('driving')
  const [showDirections, setShowDirections] = useState(false)
  const [distance, setDistance] = useState(null)

  useEffect(() => {
    if (selectedPOI) {
      setShowDirections(true)
      calculateDistance()
    } else {
      setShowDirections(false)
    }
  }, [selectedPOI])

  useEffect(() => {
    if (selectedPOI && userLocation) {
      calculateDistance()
    }
  }, [userLocation])

  const calculateDistance = () => {
    if (!userLocation || !selectedPOI) {
      setDistance(null)
      return
    }
    
    const dist = mapHelpers.calculateDistance(
      userLocation.lat,
      userLocation.lng,
      selectedPOI.latitude,
      selectedPOI.longitude
    )
    setDistance(dist)
  }

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
    return mapHelpers.formatDistance(meters)
  }

  const handleClose = () => {
    setSelectedPOI(null)
    setShowDirections(false)
  }

  if (!showDirections || !selectedPOI) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:bottom-20 md:w-80 z-30">
      <div className="bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 p-4 animate-slide-down">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaDirections className="text-blue-400 mr-2" />
            <div>
              <h3 className="font-bold text-white">Get Directions</h3>
              <p className="text-sm text-gray-400">{selectedPOI.name}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <FaTimes />
          </button>
        </div>

        {userLocation && distance !== null && (
          <div className="mb-4 p-3 bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-300">Distance from you:</div>
            <div className="text-xl font-bold text-white">{formatDistance(distance)}</div>
            <div className="text-xs text-gray-400 mt-1">
              Estimated travel time: {travelMode === 'driving' ? '~' + Math.round(distance / 800) + ' min' : 'Varies'}
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="text-sm text-gray-300 mb-2">Travel Mode:</div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { mode: 'driving', icon: FaCar, label: 'Drive' },
              { mode: 'walking', icon: FaWalking, label: 'Walk' },
              { mode: 'bicycling', icon: FaBicycle, label: 'Bike' },
              { mode: 'transit', icon: FaDirections, label: 'Transit' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setTravelMode(mode)}
                className={`py-2 rounded-lg flex flex-col items-center justify-center transition-colors ${
                  travelMode === mode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Icon className="mb-1" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {!user && (
            <div className="text-amber-400 text-sm p-2 bg-amber-900 bg-opacity-20 rounded text-center">
              Sign in to save favorite places
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
  )
}

export default Directions