import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from './useAuth'

export const usePOI = () => {
  const [pois, setPois] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fetchPOIs = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('poi')
        .select('*')
        .eq('status', 'approved')
        .order('name')
      
      if (error) throw error
      
      setPois(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching POIs:', err)
      setError(err.message)
      setPois([])
    } finally {
      setLoading(false)
    }
  }, [])

  const savePOI = useCallback(async (poiId) => {
    if (!user) {
      throw new Error('You must be logged in to save POIs')
    }

    try {
      const { error } = await supabase
        .from('saved_poi')
        .insert({
          user_id: user.id,
          poi_id: poiId
        })
      
      if (error) throw error
      return { success: true }
    } catch (err) {
      console.error('Error saving POI:', err)
      return { success: false, error: err.message }
    }
  }, [user])

  const unsavePOI = useCallback(async (poiId) => {
    if (!user) {
      throw new Error('You must be logged in to unsave POIs')
    }

    try {
      const { error } = await supabase
        .from('saved_poi')
        .delete()
        .eq('user_id', user.id)
        .eq('poi_id', poiId)
      
      if (error) throw error
      return { success: true }
    } catch (err) {
      console.error('Error unsaving POI:', err)
      return { success: false, error: err.message }
    }
  }, [user])

  const requestNewPOI = useCallback(async (poiData) => {
    if (!user) {
      throw new Error('You must be logged in to submit POI requests')
    }

    try {
      const { error } = await supabase
        .from('poi')
        .insert({
          ...poiData,
          submitted_by: user.id,
          is_approved: false
        })
      
      if (error) throw error
      return { success: true }
    } catch (err) {
      console.error('Error submitting POI request:', err)
      return { success: false, error: err.message }
    }
  }, [user])

  useEffect(() => {
    fetchPOIs()
  }, [fetchPOIs])

  return {
    pois,
    loading,
    error,
    fetchPOIs,
    savePOI,
    unsavePOI,
    requestNewPOI
  }
}