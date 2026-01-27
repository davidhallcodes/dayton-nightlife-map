import { API_CONFIG } from '../utils/constants'

// Note: Yelp API requires server-side implementation due to CORS and API key security
// This service works with the Netlify function proxy

export const yelpService = {
  // Search for businesses in Dayton nightlife
  searchNightlife: async (location = 'Dayton, OH', offset = 0) => {
    try {
      // Using Netlify function proxy
      const response = await fetch('/.netlify/functions/yelp-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          categories: 'nightlife,bars,clubs,musicvenues,breweries',
          limit: API_CONFIG.YELP_LIMIT,
          offset
        })
      })

      if (!response.ok) {
        throw new Error(`Yelp API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Transform Yelp data to match our POI format
      return data.businesses?.map(business => ({
        id: `yelp_${business.id}`,
        name: business.name,
        category: mapYelpCategory(business.categories),
        description: business.categories?.map(cat => cat.title).join(', '),
        latitude: business.coordinates.latitude,
        longitude: business.coordinates.longitude,
        address: business.location.display_address.join(', '),
        phone: business.display_phone,
        website: business.url,
        rating: business.rating,
        review_count: business.review_count,
        price: business.price,
        hours: business.hours?.[0]?.open,
        photos: business.photos,
        yelp_id: business.id,
        source: 'yelp',
        is_approved: true // Auto-approve Yelp data
      })) || []
    } catch (error) {
      console.error('Yelp search error:', error)
      return []
    }
  },

  // Get business details by Yelp ID
  getBusinessDetails: async (yelpId) => {
    try {
      const response = await fetch(`/.netlify/functions/yelp-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ yelpId })
      })

      if (!response.ok) {
        throw new Error(`Yelp details error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Yelp details error:', error)
      return null
    }
  },

  // Get reviews for a business
  getBusinessReviews: async (yelpId) => {
    try {
      const response = await fetch(`/.netlify/functions/yelp-reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ yelpId })
      })

      if (!response.ok) {
        throw new Error(`Yelp reviews error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Yelp reviews error:', error)
      return []
    }
  }
}

// Map Yelp categories to our categories
const mapYelpCategory = (yelpCategories) => {
  if (!yelpCategories || !yelpCategories.length) return 'bar'
  
  const categoryTitles = yelpCategories.map(c => c.title.toLowerCase())
  
  if (categoryTitles.some(t => t.includes('bar'))) return 'bar'
  if (categoryTitles.some(t => t.includes('club'))) return 'club'
  if (categoryTitles.some(t => t.includes('lounge'))) return 'lounge'
  if (categoryTitles.some(t => t.includes('brewery'))) return 'brewery'
  if (categoryTitles.some(t => t.includes('sports'))) return 'sportsbar'
  if (categoryTitles.some(t => t.includes('karaoke'))) return 'karaoke'
  if (categoryTitles.some(t => t.includes('music'))) return 'live_music'
  if (categoryTitles.some(t => t.includes('dance'))) return 'dance'
  if (categoryTitles.some(t => t.includes('rooftop'))) return 'rooftop'
  if (categoryTitles.some(t => t.includes('wine'))) return 'wine_bar'
  
  return 'bar'
}

export default yelpService