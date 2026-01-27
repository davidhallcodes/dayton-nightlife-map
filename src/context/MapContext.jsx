import { createContext, useContext, useState, useCallback } from 'react'
import { DEFAULT_LOCATION } from '../utils/constants'

const MapContext = createContext({})

export const useMap = () => useContext(MapContext)

export const MapProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng])
  const [zoom, setZoom] = useState(DEFAULT_LOCATION.zoom)
  const [selectedPOI, setSelectedPOI] = useState(null)
  const [activeFilters, setActiveFilters] = useState(['bar', 'club', 'lounge', 'brewery', 'sportsbar'])
  const [searchQuery, setSearchQuery] = useState('')
  const [northOrientation, setNorthOrientation] = useState(0)

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported')
      return
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setMapCenter([location.lat, location.lng])
          resolve(location)
        },
        (error) => {
          console.error('Error getting location:', error)
          reject(error)
        }
      )
    })
  }, [])

  const toggleFilter = useCallback((categoryId) => {
    setActiveFilters(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }, [])

  const flyToLocation = useCallback((lat, lng, zoomLevel = 16) => {
    setMapCenter([lat, lng])
    setZoom(zoomLevel)
  }, [])

  const resetToDefault = useCallback(() => {
    setMapCenter([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng])
    setZoom(DEFAULT_LOCATION.zoom)
    setSelectedPOI(null)
  }, [])

  const resetToUserLocation = useCallback(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng])
      setZoom(16)
    } else {
      getUserLocation()
    }
  }, [userLocation, getUserLocation])

  const value = {
    userLocation,
    mapCenter,
    zoom,
    selectedPOI,
    activeFilters,
    searchQuery,
    northOrientation,
    setMapCenter,
    setZoom,
    setSelectedPOI,
    setSearchQuery,
    setNorthOrientation,
    getUserLocation,
    toggleFilter,
    flyToLocation,
    resetToDefault,
    resetToUserLocation,
    setActiveFilters
  }

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  )
}