import { useState, useEffect } from 'react'
import { FaCheck, FaTimes, FaMapMarkerAlt, FaUser, FaCalendar } from 'react-icons/fa'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'
import mapHelpers from '../../utils/mapHelpers'

const PoiApprovalList = () => {
  const [pendingPOIs, setPendingPOIs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPOI, setSelectedPOI] = useState(null)
  const { profile } = useAuth()

  useEffect(() => {
    if (profile?.role === 'admin' || profile?.role === 'moderator') {
      fetchPendingPOIs()
    }
  }, [profile])

  const fetchPendingPOIs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('poi')
        .select('*, profiles(username, display_name, avatar_url)')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false })

      if (error) throw error
      setPendingPOIs(data || [])
    } catch (error) {
      console.error('Error fetching pending POIs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (poiId, action, reason = '') => {
    try {
      const updates = {
        status: action,
        approved_by: profile.id,
        approved_at: new Date().toISOString()
      }

      if (action === 'rejected') {
        updates.rejection_reason = reason
      }

      const { error } = await supabase
        .from('poi')
        .update(updates)
        .eq('id', poiId)

      if (error) throw error

      setPendingPOIs(prev => prev.filter(poi => poi.id !== poiId))
      setSelectedPOI(null)
    } catch (error) {
      console.error(`Error ${action}ing POI:`, error)
    }
  }

  const handleApprove = (poiId) => {
    if (confirm('Approve this submission?')) {
      handleAction(poiId, 'approved')
    }
  }

  const handleReject = (poiId) => {
    const reason = prompt('Reason for rejection:', '')
    if (reason !== null) {
      handleAction(poiId, 'rejected', reason)
    }
  }

  if (!profile || (profile.role !== 'admin' && profile.role !== 'moderator')) {
    return null
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (pendingPOIs.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <FaCheck className="text-green-400 text-2xl mx-auto mb-2" />
        <p>No pending submissions</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h3 className="font-bold text-white mb-4 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-blue-400" />
        Pending Submissions ({pendingPOIs.length})
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin pr-2">
        {pendingPOIs.map(poi => (
          <div
            key={poi.id}
            className={`bg-gray-800 rounded-lg p-3 cursor-pointer transition-colors ${
              selectedPOI?.id === poi.id ? 'ring-2 ring-blue-400' : 'hover:bg-gray-700'
            }`}
            onClick={() => setSelectedPOI(poi)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start">
                  <div className={`w-3 h-3 rounded-full mt-1 mr-2 ${
                    poi.category === 'bar' ? 'bg-blue-500' :
                    poi.category === 'club' ? 'bg-purple-500' :
                    poi.category === 'lounge' ? 'bg-pink-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-white">{poi.name}</h4>
                    <div className="text-xs text-gray-400 mt-1">
                      <span className="capitalize">{poi.category}</span>
                      {poi.profiles && (
                        <span className="ml-2 flex items-center">
                          <FaUser className="mr-1" size={10} />
                          {poi.profiles.display_name || poi.profiles.username}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {poi.description && (
                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                    {poi.description}
                  </p>
                )}
                
                <div className="text-xs text-gray-500 mt-2 flex items-center">
                  <FaCalendar className="mr-1" size={10} />
                  {new Date(poi.submitted_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex space-x-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleApprove(poi.id)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded"
                  title="Approve"
                >
                  <FaCheck size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReject(poi.id)
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded"
                  title="Reject"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            </div>

            {selectedPOI?.id === poi.id && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-400">Location</div>
                    <div className="text-white font-mono">
                      {poi.latitude.toFixed(6)}, {poi.longitude.toFixed(6)}
                    </div>
                  </div>
                  {poi.address && (
                    <div>
                      <div className="text-gray-400">Address</div>
                      <div className="text-white">{poi.address}</div>
                    </div>
                  )}
                  {poi.website && (
                    <div className="col-span-2">
                      <div className="text-gray-400">Website</div>
                      <a 
                        href={poi.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {poi.website}
                      </a>
                    </div>
                  )}
                  {poi.phone && (
                    <div>
                      <div className="text-gray-400">Phone</div>
                      <div className="text-white">{poi.phone}</div>
                    </div>
                  )}
                  {poi.price_level && (
                    <div>
                      <div className="text-gray-400">Price Level</div>
                      <div className="text-white">{poi.price_level}</div>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-end space-x-2">
                  <a
                    href={mapHelpers.getDirectionsUrl(39.7589, -84.1916, poi.latitude, poi.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PoiApprovalList