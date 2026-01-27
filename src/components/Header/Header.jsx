import { FaBars, FaCog, FaUserCircle } from 'react-icons/fa'
import { useUI } from '../../context/UIContext'
import SettingsMenu from './SettingsMenu'
import UserMenu from './UserMenu'

const Header = () => {
  const { 
    isSettingsOpen, 
    isUserMenuOpen, 
    openSettings, 
    toggleUserMenu,
    closeAllModals 
  } = useUI()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-sm text-white p-3 flex justify-between items-center border-b border-gray-700 shadow-lg">
      {/* Left: Main Menu Icon */}
      <button 
        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        onClick={closeAllModals}
      >
        <FaBars size={22} />
      </button>
      
      {/* Center: Logo/Title */}
      <div className="text-xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Dayton Nightlife
        </span>
      </div>
      
      {/* Right: Settings & User Icons */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={openSettings}
          className={`p-2 rounded-lg transition-colors ${isSettingsOpen ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
        >
          <FaCog size={22} />
        </button>
        
        <button 
          onClick={toggleUserMenu}
          className={`p-2 rounded-lg transition-colors ${isUserMenuOpen ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
        >
          <FaUserCircle size={26} />
        </button>
      </div>
      
      {/* Dropdown Menus */}
      {isSettingsOpen && <SettingsMenu />}
      {isUserMenuOpen && <UserMenu />}
    </header>
  )
}

export default Header