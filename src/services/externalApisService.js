// Google Places API service
export const googlePlacesService = {
  searchNightlife: async (location = 'Dayton, OH') => {
    try {
      const response = await fetch('/.netlify/functions/google-places-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          types: ['bar', 'nightclub', 'restaurant', 'liquor_store', 'music_venue'],
          keyword: 'nightlife'
        })
      })

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`)
      }

      const data = await response.json()
      
      return data.results?.map(place => ({
        id: `google_${place.place_id}`,
        name: place.name,
        category: mapGoogleCategory(place.types),
        description: place.formatted_address,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        address: place.formatted_address,
        phone: place.formatted_phone_number,
        website: place.website,
        rating: place.rating,
        review_count: place.user_ratings_total,
        photos: place.photos?.map(p => p.photo_reference),
        google_id: place.place_id,
        source: 'google',
        is_approved: true
      })) || []
    } catch (error) {
      console.error('Google Places error:', error)
      return []
    }
  }
}

// TripAdvisor API service
export const tripAdvisorService = {
  searchNightlife: async (location = 'Dayton, Ohio') => {
    try {
      const response = await fetch('/.netlify/functions/tripadvisor-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          categories: 'nightlife'
        })
      })

      if (!response.ok) {
        throw new Error(`TripAdvisor API error: ${response.status}`)
      }

      const data = await response.json()
      
      return data.data?.map(place => ({
        id: `tripadvisor_${place.location_id}`,
        name: place.name,
        category: mapTripAdvisorCategory(place.description),
        description: place.description,
        latitude: place.latitude,
        longitude: place.longitude,
        address: place.address,
        phone: place.phone,
        website: place.web_url,
        rating: place.rating,
        review_count: place.num_reviews,
        photos: place.photo?.images?.large?.url,
        tripadvisor_id: place.location_id,
        source: 'tripadvisor',
        is_approved: true
      })) || []
    } catch (error) {
      console.error('TripAdvisor error:', error)
      return []
    }
  }
}

// Helper functions to map external categories to your internal categories
const mapGoogleCategory = (types) => {
  const categoryMap = {
    'bar': 'bar',
    'nightclub': 'club',
    'night_club': 'club',
    'music_venue': 'live_music',
    'restaurant': 'lounge',
    'liquor_store': 'bar'
  }
  
  for (let type of types) {
    if (categoryMap[type]) return categoryMap[type]
  }
  return 'bar'
}

const mapYelpCategory = (categories) => {
  const categoryMap = {
    'bars': 'bar',
    'nightlife': 'club',
    'clubs': 'club',
    'musicvenues': 'live_music',
    'musicvenues': 'live_music',
    'breweries': 'brewery',
    'cocktailbars': 'lounge',
    'wine_bars': 'wine_bar',
    'karaoke': 'karaoke',
    'danceclubs': 'dance'
  }
  
  if (categories && categories.length > 0) {
    const alias = categories[0].alias
    return categoryMap[alias] || 'bar'
  }
  return 'bar'
}

const mapTripAdvisorCategory = (description) => {
  const desc = (description || '').toLowerCase()
  
  if (desc.includes('bar')) return 'bar'
  if (desc.includes('club')) return 'club'
  if (desc.includes('brewery')) return 'brewery'
  if (desc.includes('wine')) return 'wine_bar'
  if (desc.includes('music')) return 'live_music'
  if (desc.includes('karaoke')) return 'karaoke'
  if (desc.includes('dance')) return 'dance'
  
  return 'lounge'
}

export default {
  yelpService,
  googlePlacesService,
  tripAdvisorService
}
