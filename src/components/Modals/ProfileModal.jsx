import { useState, useEffect } from 'react'
import { FaTimes, FaUser, FaEnvelope, FaCalendar, FaSave, FaCamera } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { supabase } from '../../services/supabase'

const ProfileModal = () => {
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  
  const { profile, updateProfile } = useAuth()
  const { closeProfileModal } = useUI()

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setUsername(profile.username || '')
      setEmail(profile.email || '')
      setAvatarUrl(profile.avatar_url || '')
    }
  }, [profile])

  const handleAvatarUpload = async (file) => {
    if (!file) return
    
    try {
      setLoading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
      return publicUrl
    } catch (err) {
      setError('Failed to upload avatar')
      console.error(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!displayName.trim()) {
      setError('Display name is required')
      return
    }
    
    if (!username.trim()) {
      setError('Username is required')
      return
    }
    
    if (!username.match(/^[a-zA-Z0-9_]+$/)) {
      setError('Username can only contain letters, numbers, and underscores')
      return
    }

    setLoading(true)
    
    try {
      const updates = {
        display_name: displayName.trim(),
        username: username.trim().toLowerCase()
      }

      if (avatarFile) {
        const newAvatarUrl = await handleAvatarUpload(avatarFile)
        if (newAvatarUrl) {
          updates.avatar_url = newAvatarUrl
        }
      }

      const { error: updateError } = await updateProfile(updates)
      
      if (updateError) throw updateError
      
      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        closeProfileModal()
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB')
      return
    }
    
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarUrl(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <button
              onClick={closeProfileModal}
              className="text-gray-400 hover:text-white p-1"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-20 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900 bg-opacity-20 text-green-400 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                      {displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <p className="text-sm text-gray-400">
                Click camera icon to upload new avatar (max 2MB)
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="Your name as shown to others"
                  maxLength={50}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="unique_username"
                  maxLength={20}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                This will be used in your profile URL: nightlifemap.app/user/{username || 'username'}
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="input-field pl-10 w-full bg-gray-900 cursor-not-allowed"
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Contact support to change email address
              </div>
            </div>

            {/* Member Since */}
            {profile?.created_at && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Member Since
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendar className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    readOnly
                    className="input-field pl-10 w-full bg-gray-900 cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={closeProfileModal}
                  className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal