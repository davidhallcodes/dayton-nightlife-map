const axios = require('axios')

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { location, types, keyword } = JSON.parse(event.body)
    
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key not configured')
    }

    // First, get the location coordinates using Geocoding API
    const geocodingResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: location,
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      }
    )

    if (geocodingResponse.data.results.length === 0) {
      throw new Error('Location not found')
    }

    const { lat, lng } = geocodingResponse.data.results[0].geometry.location

    // Search for places near the location
    const placesResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          type: types?.[0] || 'bar',
          keyword: keyword || 'nightlife',
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      }
    )

    // Get detailed info for each place
    const detailedResults = await Promise.all(
      placesResponse.data.results.slice(0, 20).map(place =>
        axios.get(
          'https://maps.googleapis.com/maps/api/place/details/json',
          {
            params: {
              place_id: place.place_id,
              fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,photos,types,geometry',
              key: process.env.GOOGLE_PLACES_API_KEY
            }
          }
        ).then(res => res.data.result)
      )
    )

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ results: detailedResults })
    }
  } catch (error) {
    console.error('Google Places proxy error:', error.message)
    
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    }
  }
}
