import L from 'leaflet'

export const mapHelpers = {
  // Create custom marker icon
  createMarkerIcon: (category, isSelected = false) => {
    const colors = {
      bar: '#3b82f6',
      club: '#8b5cf6',
      lounge: '#ec4899',
      brewery: '#d97706',
      sportsbar: '#10b981',
      karaoke: '#ef4444',
      live_music: '#eab308',
      dance: '#6366f1',
      rooftop: '#14b8a6',
      wine_bar: '#f43f5e'
    }

    const color = colors[category] || '#6b7280'
    const size = isSelected ? 50 : 40
    const borderWidth = isSelected ? 4 : 2

    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border-radius: 50%;
          border: ${borderWidth}px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${size * 0.4}px;
          color: white;
          font-weight: bold;
          transition: all 0.2s ease;
        ">
          ${category.charAt(0).toUpperCase()}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size]
    })
  },

  // Calculate bounds for multiple points
  calculateBounds: (points) => {
    if (!points || points.length === 0) {
      return [
        [39.6, -84.4], // Southwest
        [39.9, -84.0]  // Northeast
      ]
    }

    const lats = points.map(p => p.latitude || p[0])
    const lngs = points.map(p => p.longitude || p[1])

    return [
      [Math.min(...lats), Math.min(...lngs)], // Southwest
      [Math.max(...lats), Math.max(...lngs)]  // Northeast
    ]
  },

  // Calculate center point
  calculateCenter: (points) => {
    if (!points || points.length === 0) {
      return [39.7589, -84.1916] // Dayton center
    }

    const sumLat = points.reduce((sum, p) => sum + (p.latitude || p[0]), 0)
    const sumLng = points.reduce((sum, p) => sum + (p.longitude || p[1]), 0)

    return [sumLat / points.length, sumLng / points.length]
  },

  // Format coordinates for display
  formatCoordinates: (lat, lng, precision = 4) => {
    const latDir = lat >= 0 ? 'N' : 'S'
    const lngDir = lng >= 0 ? 'E' : 'W'
    
    return `${Math.abs(lat).toFixed(precision)}°${latDir}, ${Math.abs(lng).toFixed(precision)}°${lngDir}`
  },

  // Calculate zoom level based on distance
  calculateZoomForDistance: (distanceKm) => {
    if (distanceKm < 1) return 16
    if (distanceKm < 5) return 14
    if (distanceKm < 20) return 12
    if (distanceKm < 50) return 10
    if (distanceKm < 100) return 8
    return 6
  },

  // Generate static map URL (for sharing)
  generateStaticMapUrl: (lat, lng, zoom = 14, width = 600, height = 400) => {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l-bar+285A98(${lng},${lat})/${lng},${lat},${zoom},0/${width}x${height}?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
  },

  // Get directions URL
  getDirectionsUrl: (fromLat, fromLng, toLat, toLng, mode = 'driving') => {
    const modes = {
      driving: 'driving',
      walking: 'walking',
      bicycling: 'bicycling',
      transit: 'transit'
    }

    const travelMode = modes[mode] || 'driving'
    
    return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=${travelMode}`
  },

  // Check if point is within bounds
  isPointInBounds: (lat, lng, bounds) => {
    if (!bounds) return true
    
    const [sw, ne] = bounds
    return lat >= sw[0] && lat <= ne[0] && lng >= sw[1] && lng <= ne[1]
  },

  // Convert meters to readable distance
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

  // Generate random color for categories
  getRandomColor: () => {
    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', '#10b981',
      '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
}

export default mapHelpers