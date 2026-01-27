import { useState, useEffect } from 'react'
import { FaCheck, FaTimes, FaEye, FaTrash, FaStar, FaFilter } from 'react-icons/fa'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'

const AdminPanel = () => {
  const [pendingPOIs, setPendingPOIs] = useState([])
  const [reviews, setReviews] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const { profile } = useAuth()

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData()
    }
  }, [profile])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'pending') {
        const { data } = await supabase
          .from('poi')
          .select('*, profiles(username, display_name)')
          .eq('status', 'pending')
          .order('submitted_at', { ascending: false })
        setPendingPOIs(data || [])
      } else if (activeTab === 'reviews') {
        const { data } = await supabase
          .from('reviews')
          .select('*, profiles(username, display_name), poi(name)')
          .order('created_at', { ascending: false })
          .limit(50)
        setReviews(data || [])
      } else if (activeTab === 'users') {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)
        setUsers(data || [])
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprovePOI = async (poiId) => {
    try {
      const { error } = await supabase
        .from('poi')
        .update({
          status: 'approved',
          approved_by: profile.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', poiId)

      if (error) throw error

      setPendingPOIs(prev => prev.filter(poi => poi.id !== poiId))
    } catch (error) {
      console.error('Error approving POI:', error)
    }
  }

  const handleRejectPOI = async (poiId, reason) => {
    const rejectionReason = prompt('Please enter rejection reason:', reason || '')
    if (rejectionReason === null) return

    try {
      const { error } = await supabase
        .from('poi')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          approved_by: profile.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', poiId)

      if (error) throw error

      setPendingPOIs(prev => prev.filter(poi => poi.id !== poiId))
    } catch (error) {
      console.error('Error rejecting POI:', error)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)

      if (error) throw error

      setReviews(prev => prev.filter(review => review.id !== reviewId))
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p className="text-gray-400 mt-2">Admin privileges required</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700">
        {['pending', 'reviews', 'users'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              fetchData()
            }}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab} {tab === 'pending' && pendingPOIs.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingPOIs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
          <p className="text-gray-400 mt-2">Loading...</p>
        </div>
      ) : activeTab === 'pending' ? (
        <div className="space-y-4">
          {pendingPOIs.length === 0 ? (
            <div className="text-center py-12">
              <FaCheck className="text-green-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-400">No pending submissions</p>
            </div>
          ) : (
            pendingPOIs.map(poi => (
              <div key={poi.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{poi.name}</h3>
                    <p className="text-gray-400">{poi.category} • Submitted by {poi.profiles?.display_name || poi.profiles?.username}</p>
                    {poi.description && (
                      <p className="text-gray-300 mt-2">{poi.description}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-400">
                      {poi.address && <div>📍 {poi.address}</div>}
                      <div>📍 Coordinates: {poi.latitude}, {poi.longitude}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprovePOI(poi.id)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleRejectPOI(poi.id, poi.rejection_reason)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
                    <a
                      href={`https://www.google.com/maps?q=${poi.latitude},${poi.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                      title="View on Map"
                    >
                      <FaEye />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'reviews' ? (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="text-gray-400">on {review.poi?.name}</span>
                  </div>
                  <p className="text-white mt-2">{review.comment}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    By {review.profiles?.display_name || review.profiles?.username}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                  title="Delete Review"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'users' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 text-gray-400 font-medium">User</th>
                <th className="pb-3 text-gray-400 font-medium">Role</th>
                <th className="pb-3 text-gray-400 font-medium">Joined</th>
                <th className="pb-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-800">
                  <td className="py-3">
                    <div>
                      <div className="font-medium text-white">{user.display_name || user.username}</div>
                      <div className="text-gray-400 text-sm">@{user.username}</div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-red-500' :
                      user.role === 'moderator' ? 'bg-blue-500' :
                      'bg-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                      className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                      disabled={user.id === profile.id}
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

export default AdminPanel