import { useState } from 'react'
import { FaFilter, FaTimes, FaBeer, FaMusic, FaCocktail, FaTv, FaMicrophone, FaGuitar, FaUsers, FaUmbrellaBeach, FaWineGlassAlt } from 'react-icons/fa'
import { CATEGORIES } from '../../utils/constants'
import { useMap } from '../../context/MapContext'
import { useUI } from '../../context/UIContext'

const iconMap = {
  bar: FaBeer,
  club: FaMusic,
  lounge: FaCocktail,
  sportsbar: FaTv,
  karaoke: FaMicrophone,
  live_music: FaGuitar,
  dance: FaUsers,
  rooftop: FaUmbrellaBeach,
  wine_bar: FaWineGlassAlt,
  brewery: FaBeer
}

const CategoryFilter = () => {
  const { activeFilters, toggleFilter, setActiveFilters } = useMap()
  const { isFilterMenuOpen, toggleFilterMenu } = useUI()
  const [showAll, setShowAll] = useState(false)

  const handleSelectAll = () => {
    setActiveFilters(CATEGORIES.map(cat => cat.id))
  }

  const handleClearAll = () => {
    setActiveFilters([])
  }

  const visibleCategories = showAll 
    ? CATEGORIES 
    : CATEGORIES.slice(0, 5)

  if (!isFilterMenuOpen) {
    return (
      <button
        onClick={toggleFilterMenu}
        className="fixed left-4 top-20 z-40 bg-gray-800 bg-opacity-90 backdrop-blur-sm text-white p-3 rounded-xl shadow-xl hover:bg-gray-700 transition-colors"
        title="Show filters"
      >
        <FaFilter size={20} />
      </button>
    )
  }

  return (
    <div className="fixed left-4 top-20 z-40 bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 w-72 animate-slide-down">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaFilter className="text-blue-400 mr-2" />
            <h3 className="font-bold text-white">Venue Types</h3>
          </div>
          <button
            onClick={toggleFilterMenu}
            className="text-gray-400 hover:text-white p-1"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin pr-2">
          {visibleCategories.map((category) => {
            const Icon = iconMap[category.id] || FaBeer
            const isActive = activeFilters.includes(category.id)
            
            return (
              <button
                key={category.id}
                onClick={() => toggleFilter(category.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all ${
                  isActive 
                    ? `${category.color} bg-opacity-20 border-l-4 ${category.color.replace('bg-', 'border-')}` 
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  isActive ? category.color : 'bg-gray-700'
                }`}>
                  <Icon className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {category.name}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                    {isActive ? 'Showing' : 'Hidden'} on map
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-600'}`} />
              </button>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex space-x-2 mb-3">
            <button
              onClick={handleSelectAll}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          
          {!showAll && CATEGORIES.length > 5 && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full text-center text-blue-400 hover:text-blue-300 text-sm py-2"
            >
              Show all {CATEGORIES.length} categories
            </button>
          )}
          
          {showAll && (
            <button
              onClick={() => setShowAll(false)}
              className="w-full text-center text-blue-400 hover:text-blue-300 text-sm py-2"
            >
              Show fewer
            </button>
          )}
        </div>

        <div className="mt-4 p-3 bg-gray-900 rounded-lg">
          <div className="text-xs text-gray-400">
            <span className="text-green-400 font-semibold">{activeFilters.length}</span> of{' '}
            <span className="font-semibold">{CATEGORIES.length}</span> categories active
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryFilter