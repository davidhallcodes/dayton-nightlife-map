const axios = require('axios')

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { location, categories } = JSON.parse(event.body)
    
    if (!process.env.TRIPADVISOR_API_KEY) {
      throw new Error('TripAdvisor API key not configured')
    }

    // TripAdvisor Content API search endpoint
    const response = await axios.get(
      'https://api.content.tripadvisor.com/api/v1/location/search',
      {
        params: {
          key: process.env.TRIPADVISOR_API_KEY,
          searchQuery: `${location} ${categories || 'nightlife'}`,
          language: 'en'
        }
      }
    )

    // Get details for each location
    const detailedResults = await Promise.all(
      response.data.data.slice(0, 20).map(place =>
        axios.get(
          `https://api.content.tripadvisor.com/api/v1/location/${place.location_id}/details`,
          {
            params: {
              key: process.env.TRIPADVISOR_API_KEY,
              language: 'en',
              fields: 'name,rating,description,web_url,phone,address,location_string,photo,review_count'
            }
          }
        ).then(res => res.data)
      )
    )

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ data: detailedResults })
    }
  } catch (error) {
    console.error('TripAdvisor proxy error:', error.message)
    
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
