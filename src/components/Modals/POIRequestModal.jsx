import { useState, useEffect } from 'react'
import { FaTimes, FaMapMarkerAlt, FaTag, FaInfoCircle, FaStar, FaUpload } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { usePOI } from '../../hooks/usePOI'
import { CATEGORIES } from '../../utils/constants'

const POIRequestModal = () => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('bar')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [website, setWebsite] = useState('')
  const [phone, setPhone] = useState('')
  const [hours, setHours] = useState('')
  const [priceLevel, setPriceLevel] = useState('$$')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { user } = useAuth()
  const { closePOIRequestModal } = useUI()
  const { requestNewPOI } = usePOI()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6))
          setLongitude(position.coords.longitude.toFixed(6))
        },
        () => {
          // Default to Dayton coordinates
          setLatitude('39.7589')
          setLongitude('-84.1916')
        }
      )
    }
  }, [])

  const validateForm = () => {
    if (!name.trim()) {
      setError('Venue name is required')
      return false
    }
    if (!category) {
      setError('Please select a category')
      return false
    }
    if (!latitude || !longitude) {
      setError('Please provide location coordinates')
      return false
    }
    if (description.length > 500) {
      setError('Description must be less than 500 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!user) {
      setError('You must be logged in to submit venues')
      return
    }
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const poiData = {
        name: name.trim(),
        category,
        description: description.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address.trim(),
        website: website.trim(),
        phone: phone.trim(),
        hours: hours.trim(),
        price_level: priceLevel
      }
      
      const { success: submitted, error: submitError } = await requestNewPOI(poiData)
      
      if (submitError) throw new Error(submitError)
      
      if (submitted) {
        setSuccess('Venue submitted successfully! It will appear on the map after admin approval.')
        setTimeout(() => {
          closePOIRequestModal()
        }, 3000)
      }
    } catch (err) {
      setError(err.message || 'Failed to submit venue')
    } finally {
      setLoading(false)
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6))
          setLongitude(position.coords.longitude.toFixed(6))
        },
        (err) => {
          setError('Unable to get current location')
        }
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 my-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Submit New Venue</h2>
              <p className="text-gray-400 mt-1">
                Suggest a nightlife spot for Dayton
              </p>
            </div>
            <button
              onClick={closePOIRequestModal}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field w-full"
                  placeholder="e.g., The Neon Moon Bar"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field w-full"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field w-full h-32 resize-none"
                placeholder="Tell us about this venue... What makes it special?"
                maxLength={500}
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {description.length}/500 characters
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field w-full"
                  placeholder="e.g., 123 Main St, Dayton, OH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price Level
                </label>
                <div className="flex space-x-2">
                  {['$', '$$', '$$$', '$$$$'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriceLevel(level)}
                      className={`flex-1 py-2 rounded-lg ${
                        priceLevel === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="input-field w-full"
                  placeholder="e.g., 39.7589"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="input-field w-full"
                  placeholder="e.g., -84.1916"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                >
                  <FaMapMarkerAlt />
                  <span>Use My Location</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="input-field w-full"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field w-full"
                  placeholder="(937) 555-0123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hours of Operation
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="input-field w-full"
                placeholder="e.g., Mon-Thu: 4pm-2am, Fri-Sat: 4pm-2:30am, Sun: 12pm-12am"
              />
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center text-gray-400 mb-4">
                <FaInfoCircle className="mr-2" />
                <span className="text-sm">
                  All submissions require admin approval. Please provide accurate information.
                </span>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading || !user}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      <span>Submit for Approval</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={closePOIRequestModal}
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

export default POIRequestModal