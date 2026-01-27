import { createContext, useContext, useState } from 'react'

const UIContext = createContext({})

export const useUI = () => useContext(UIContext)

export const UIProvider = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isPOIRequestModalOpen, setIsPOIRequestModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(true)

  const openSettings = () => {
    setIsSettingsOpen(true)
    setIsUserMenuOpen(false)
  }

  const closeSettings = () => setIsSettingsOpen(false)

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev)
    setIsSettingsOpen(false)
  }

  const closeUserMenu = () => setIsUserMenuOpen(false)

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    closeUserMenu()
    closeSettings()
  }

  const closeLoginModal = () => setIsLoginModalOpen(false)

  const openPOIRequestModal = () => {
    setIsPOIRequestModalOpen(true)
    closeUserMenu()
  }

  const closePOIRequestModal = () => setIsPOIRequestModalOpen(false)

  const openProfileModal = () => {
    setIsProfileModalOpen(true)
    closeUserMenu()
  }

  const closeProfileModal = () => setIsProfileModalOpen(false)

  const toggleFilterMenu = () => setIsFilterMenuOpen(prev => !prev)

  const closeAllModals = () => {
    setIsSettingsOpen(false)
    setIsUserMenuOpen(false)
    setIsLoginModalOpen(false)
    setIsPOIRequestModalOpen(false)
    setIsProfileModalOpen(false)
  }

  const value = {
    isSettingsOpen,
    isUserMenuOpen,
    isLoginModalOpen,
    isPOIRequestModalOpen,
    isProfileModalOpen,
    isFilterMenuOpen,
    openSettings,
    closeSettings,
    toggleUserMenu,
    closeUserMenu,
    openLoginModal,
    closeLoginModal,
    openPOIRequestModal,
    closePOIRequestModal,
    openProfileModal,
    closeProfileModal,
    toggleFilterMenu,
    closeAllModals
  }

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  )
}