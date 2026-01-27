export const validation = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Username validation
  isValidUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    return usernameRegex.test(username)
  },

  // Password validation
  isValidPassword: (password) => {
    return password.length >= 6
  },

  // Phone number validation (US format)
  isValidPhone: (phone) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    return phoneRegex.test(phone)
  },

  // URL validation
  isValidUrl: (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Latitude validation
  isValidLatitude: (lat) => {
    const num = parseFloat(lat)
    return !isNaN(num) && num >= -90 && num <= 90
  },

  // Longitude validation
  isValidLongitude: (lng) => {
    const num = parseFloat(lng)
    return !isNaN(num) && num >= -180 && num <= 180
  },

  // Validate POI submission
  validatePOI: (poiData) => {
    const errors = []

    if (!poiData.name || poiData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters')
    }

    if (!poiData.category) {
      errors.push('Category is required')
    }

    if (!validation.isValidLatitude(poiData.latitude)) {
      errors.push('Invalid latitude')
    }

    if (!validation.isValidLongitude(poiData.longitude)) {
      errors.push('Invalid longitude')
    }

    if (poiData.description && poiData.description.length > 500) {
      errors.push('Description must be less than 500 characters')
    }

    if (poiData.website && !validation.isValidUrl(poiData.website)) {
      errors.push('Invalid website URL')
    }

    if (poiData.phone && !validation.isValidPhone(poiData.phone)) {
      errors.push('Invalid phone number format')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Validate user profile
  validateProfile: (profileData) => {
    const errors = []

    if (!profileData.display_name || profileData.display_name.trim().length < 2) {
      errors.push('Display name must be at least 2 characters')
    }

    if (!validation.isValidUsername(profileData.username)) {
      errors.push('Username must be 3-20 characters (letters, numbers, underscores only)')
    }

    if (profileData.bio && profileData.bio.length > 500) {
      errors.push('Bio must be less than 500 characters')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Sanitize input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  },

  // Format error message
  formatError: (error) => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    return 'An unknown error occurred'
  }
}

export default validation