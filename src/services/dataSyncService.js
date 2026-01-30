import { supabase } from './supabase'
import { yelpService } from './yelpAPI'
import { googlePlacesService, tripAdvisorService } from './externalApisService'

export const dataSyncService = {
  // Sync all external data sources to Supabase
  syncAllSources: async () => {
    try {
      console.log('Starting data sync from external sources...')
      
      const [yelpData, googleData, tripAdvisorData] = await Promise.all([
        yelpService.searchNightlife('Dayton, OH'),
        googlePlacesService.searchNightlife('Dayton, OH'),
        tripAdvisorService.searchNightlife('Dayton, Ohio')
      ])

      console.log(`Fetched ${yelpData.length} from Yelp, ${googleData.length} from Google, ${tripAdvisorData.length} from TripAdvisor`)

      // Combine and deduplicate data
      const allData = [...yelpData, ...googleData, ...tripAdvisorData]
      const deduplicatedData = dataSyncService.deduplicateVenues(allData)

      console.log(`After deduplication: ${deduplicatedData.length} unique venues`)

      // Upsert to Supabase
      const results = await Promise.all(
        deduplicatedData.map(venue => dataSyncService.upsertVenue(venue))
      )

      return {
        success: true,
        total: results.length,
        yelp: yelpData.length,
        google: googleData.length,
        tripAdvisor: tripAdvisorData.length
      }
    } catch (error) {
      console.error('Error syncing data:', error)
      return { success: false, error: error.message }
    }
  },

  // Deduplicate venues by checking proximity and name similarity
  deduplicateVenues: (venues) => {
    const seen = new Set()
    const deduped = []

    for (const venue of venues) {
      // Check if similar venue already exists
      const isDuplicate = deduped.some(existing => {
        const distance = Math.sqrt(
          Math.pow(existing.latitude - venue.latitude, 2) +
          Math.pow(existing.longitude - venue.longitude, 2)
        )
        
        // Within 0.002 degrees (about 200m) and similar name
        const similarLocation = distance < 0.002
        const similarName = existing.name.toLowerCase().includes(venue.name.toLowerCase()) ||
                           venue.name.toLowerCase().includes(existing.name.toLowerCase())
        
        return similarLocation && similarName
      })

      if (!isDuplicate) {
        deduped.push(venue)
        seen.add(venue.id)
      }
    }

    return deduped
  },

  // Upsert a single venue to Supabase
  upsertVenue: async (venue) => {
    try {
      // Check if venue already exists by external ID
      const { data: existing } = await supabase
        .from('poi')
        .select('id')
        .or(`yelp_id.eq.${venue.yelp_id},google_id.eq.${venue.google_id},tripadvisor_id.eq.${venue.tripadvisor_id}`)
        .single()

      const poiData = {
        name: venue.name,
        category: venue.category,
        description: venue.description,
        latitude: venue.latitude,
        longitude: venue.longitude,
        address: venue.address,
        phone: venue.phone,
        website: venue.website,
        average_rating: venue.rating || 0,
        review_count: venue.review_count || 0,
        price_level: venue.price,
        yelp_id: venue.yelp_id,
        google_id: venue.google_id,
        tripadvisor_id: venue.tripadvisor_id,
        status: 'approved'
      }

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('poi')
          .update(poiData)
          .eq('id', existing.id)
        
        if (error) throw error
        return { action: 'updated', id: existing.id }
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('poi')
          .insert([poiData])
          .select('id')
        
        if (error) throw error
        return { action: 'inserted', id: data?.[0]?.id }
      }
    } catch (error) {
      console.error(`Error upserting venue ${venue.name}:`, error)
      return { action: 'error', error: error.message }
    }
  }
}

export default dataSyncService
