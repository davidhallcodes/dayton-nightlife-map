export const CATEGORIES = [
  { id: 'bar', name: 'Bars', icon: 'Beer', color: 'bg-blue-500' },
  { id: 'club', name: 'Clubs', icon: 'Music', color: 'bg-purple-500' },
  { id: 'lounge', name: 'Lounges', icon: 'Cocktail', color: 'bg-pink-500' },
  { id: 'brewery', name: 'Breweries', icon: 'Beer', color: 'bg-amber-600' },
  { id: 'sportsbar', name: 'Sports Bars', icon: 'Tv', color: 'bg-green-500' },
  { id: 'karaoke', name: 'Karaoke', icon: 'Microphone', color: 'bg-red-500' },
  { id: 'live_music', name: 'Live Music', icon: 'Guitar', color: 'bg-yellow-500' },
  { id: 'dance', name: 'Dance Clubs', icon: 'Users', color: 'bg-indigo-500' },
  { id: 'rooftop', name: 'Rooftop', icon: 'Umbrella', color: 'bg-teal-500' },
  { id: 'wine_bar', name: 'Wine Bars', icon: 'Wine', color: 'bg-rose-500' }
]

export const DEFAULT_LOCATION = {
  lat: 39.7589,
  lng: -84.1916,
  zoom: 15
}

export const DAYTON_BOUNDS = {
  north: 39.9,
  south: 39.6,
  east: -84.0,
  west: -84.4
}

export const API_CONFIG = {
  YELP_LIMIT: 50,
  CACHE_DURATION: 3600000, // 1 hour in milliseconds
  SEARCH_RADIUS: 5000 // 5km in meters
}

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
}