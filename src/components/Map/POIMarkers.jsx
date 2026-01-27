import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { FaBeer, FaMusic, FaCocktail, FaTv, FaMicrophone, FaGuitar, FaUsers, FaUmbrellaBeach, FaWineGlassAlt } from 'react-icons/fa'
import { usePOI } from '../../hooks/usePOI'
import { useMap } from '../../context/MapContext'
import { CATEGORIES } from '../../utils/constants'

// Create custom icons for each category
const createIcon = (categoryId, color) => {
  const iconHtml = (() => {
    switch(categoryId) {
      case 'bar': return FaBeer
      case 'club': return FaMusic
      case 'lounge': return FaCocktail
      case 'sportsbar': return FaTv
      case 'karaoke': return FaMicrophone
      case 'live_music': return FaGuitar
      case 'dance': return FaUsers
      case 'rooftop': return FaUmbrellaBeach
      case 'wine_bar': return FaWineGlassAlt
      default: return FaBeer
    }
  })()
  
  return L.divIcon({
    html: `<div class="w-10 h-10 rounded-full ${color} flex items-center justify-center text-white shadow-lg border-2 border-white">
             <i class="text-lg">${String.fromCodePoint(0x2665)}</i>
           </div>`,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

const POIMarkers = () => {
  const { pois, loading } = usePOI()
  const { activeFilters, selectedPOI, flyToLocation } = useMap()

  if (loading) return null

  const filteredPOIs = pois.filter(poi => activeFilters.includes(poi.category))

  return (
    <>
      {filteredPOIs.map(poi => {
        const category = CATEGORIES.find(c => c.id === poi.category)
        const icon = createIcon(poi.category, category?.color || 'bg-gray-600')
        
        return (
          <Marker
            key={poi.id}
            position={[poi.latitude, poi.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => flyToLocation(poi.latitude, poi.longitude)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-1">{poi.name}</h3>
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${category?.color} text-white`}>
                    {category?.name || poi.category}
                  </span>
                </div>
                {poi.description && (
                  <p className="text-gray-600 mb-3">{poi.description}</p>
                )}
                <div className="space-y-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}

export default POIMarkers