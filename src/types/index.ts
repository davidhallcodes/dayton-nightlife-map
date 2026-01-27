export interface User {
  id: string
  email: string
  username: string
  display_name?: string
  avatar_url?: string
  bio?: string
  role: 'admin' | 'moderator' | 'user'
  created_at: string
  updated_at: string
}

export interface POI {
  id: string
  name: string
  category: string
  description?: string
  latitude: number
  longitude: number
  address?: string
  website?: string
  phone?: string
  hours?: Record<string, any>
  price_level?: '$' | '$$' | '$$$' | '$$$$'
  yelp_id?: string
  google_id?: string
  tripadvisor_id?: string
  status: 'pending' | 'approved' | 'rejected'
  is_featured: boolean
  featured_until?: string
  average_rating: number
  review_count: number
  submitted_by?: string
  submitted_at: string
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  poi_id: string
  user_id: string
  rating: number
  comment?: string
  photos?: string[]
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  display_order: number
  is_active: boolean
}

export interface SavedPOI {
  user_id: string
  poi_id: string
  created_at: string
}

export interface Location {
  lat: number
  lng: number
  accuracy?: number
  timestamp?: number
}

export interface MapState {
  center: [number, number]
  zoom: number
  userLocation: Location | null
  selectedPOI: POI | null
  activeFilters: string[]
  searchQuery: string
  northOrientation: number
}

export interface UIState {
  isSettingsOpen: boolean
  isUserMenuOpen: boolean
  isLoginModalOpen: boolean
  isPOIRequestModalOpen: boolean
  isProfileModalOpen: boolean
  isFilterMenuOpen: boolean
}

export interface AuthState {
  user: User | null
  profile: User | null
  loading: boolean
}

export type Theme = 'light' | 'dark' | 'system'