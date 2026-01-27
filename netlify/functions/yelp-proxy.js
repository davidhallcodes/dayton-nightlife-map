const axios = require('axios')

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { location, categories, limit = 20, offset = 0 } = JSON.parse(event.body)
    
    if (!process.env.YELP_API_KEY) {
      throw new Error('Yelp API key not configured')
    }

    const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        location: location || 'Dayton, OH',
        categories: categories || 'nightlife',
        limit: Math.min(limit, 50), // Yelp max is 50
        offset,
        sort_by: 'rating',
        radius: 5000 // 5km radius
      }
    })

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(response.data)
    }
  } catch (error) {
    console.error('Yelp proxy error:', error.response?.data || error.message)
    
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: error.response?.data?.error?.description || error.message 
      })
    }
  }
}