import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useMap } from '../../context/MapContext'

// Create custom user location icon (blue dot with accuracy circle)
const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
        <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
      </div>
    `,
    className: 'user-location-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
}

const UserLocationMarker = () => {
  const { userLocation } = useMap()

  if (!userLocation) return null

  return (
    <Marker
      position={[userLocation.lat, userLocation.lng]}
      icon={createUserLocationIcon()}
      interactive={true}
    >
      <Popup>
        <div className="text-center">
          <div className="font-semibold text-gray-900">Your Location</div>
          <div className="text-sm text-gray-600 mt-1">
            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

export default UserLocationMarker
