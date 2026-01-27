import { DAYTON_BOUNDS } from '../utils/constants'

export const locationService = {
  // Get user's current location
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          })
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location'
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timeout'
              break
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  },

  // Check if location is within Dayton bounds
  isWithinDayton: (lat, lng) => {
    return (
      lat >= DAYTON_BOUNDS.south &&
      lat <= DAYTON_BOUNDS.north &&
      lng >= DAYTON_BOUNDS.west &&
      lng <= DAYTON_BOUNDS.east
    )
  },

  // Calculate distance between two coordinates in meters
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180
    const φ2 = lat2 * Math.PI/180
    const Δφ = (lat2 - lat1) * Math.PI/180
    const Δλ = (lng2 - lng1) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c
  },

  // Format distance for display
  formatDistance: (meters) => {
    if (meters < 100) {
      return `${Math.round(meters)}m`
    } else if (meters < 1000) {
      return `${Math.round(meters)}m`
    } else if (meters < 10000) {
      return `${(meters / 1000).toFixed(1)}km`
    } else {
      return `${Math.round(meters / 1000)}km`
    }
  },

  // Get address from coordinates (reverse geocoding)
  getAddressFromCoords: async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding failed')
      }
      
      const data = await response.json()
      
      if (data.address) {
        const address = data.address
        const parts = []
        
        if (address.road) parts.push(address.road)
        if (address.city || address.town || address.village) {
          parts.push(address.city || address.town || address.village)
        }
        if (address.state) parts.push(address.state)
        if (address.country) parts.push(address.country)
        
        return parts.join(', ')
      }
      
      return null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  },

  // Search for locations by query
  searchLocations: async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&bounded=1&viewbox=${DAYTON_BOUNDS.west},${DAYTON_BOUNDS.north},${DAYTON_BOUNDS.east},${DAYTON_BOUNDS.south}`
      )
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data = await response.json()
      return data.map(result => ({
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: result.display_name,
        address: result.address
      }))
    } catch (error) {
      console.error('Location search error:', error)
      return []
    }
  },

  // Watch position for real-time updates
  watchPosition: (callback, errorCallback) => {
    if (!navigator.geolocation) {
      errorCallback(new Error('Geolocation not supported'))
      return null
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        })
      },
      errorCallback,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    )

    return watchId
  },

  // Clear position watch
  clearWatch: (watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
  }
}

export default locationService