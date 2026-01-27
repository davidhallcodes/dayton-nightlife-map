import { FaUser, FaSignInAlt, FaPlus, FaSignOutAlt, FaCog } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'

const UserMenu = () => {
  const { user, profile, signOut } = useAuth()
  const { openLoginModal, openProfileModal, openPOIRequestModal, closeUserMenu } = useUI()

  const handleSignOut = async () => {
    await signOut()
    closeUserMenu()
  }

  if (!user) {
    return (
      <div className="absolute right-2 top-16 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-slide-down z-50">
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-3 text-white">Guest User</h3>
          <p className="text-gray-400 text-sm mb-4">
            Create an account to save favorite places and submit new locations.
          </p>
          <button
            onClick={openLoginModal}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <FaSignInAlt className="mr-2" />
            Sign In / Register
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute right-2 top-16 w-72 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-slide-down z-50">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {profile?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="ml-3">
            <div className="font-bold text-white">{profile?.display_name || profile?.username || 'User'}</div>
            <div className="text-sm text-gray-400">@{profile?.username || 'user'}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={openProfileModal}
            className="flex items-center w-full p-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
          >
            <FaUser className="mr-3 text-blue-400" />
            <span className="text-white">My Profile</span>
          </button>
          
          <button
            onClick={openPOIRequestModal}
            className="flex items-center w-full p-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
          >
            <FaPlus className="mr-3 text-green-400" />
            <span className="text-white">Submit New Venue</span>
          </button>
          
          <button
            onClick={handleSignOut}
            className="flex items-center w-full p-3 hover:bg-gray-700 rounded-lg transition-colors text-left text-red-400"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserMenu