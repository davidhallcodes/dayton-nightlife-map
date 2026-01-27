-- Users table (handled by Supabase Auth)
-- Extend with profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- POI (Points of Interest) table
CREATE TABLE poi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  yelp_id TEXT,
  google_id TEXT,
  tripadvisor_id TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  submitted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved POIs (user favorites)
CREATE TABLE saved_poi (
  user_id UUID REFERENCES profiles(id),
  poi_id UUID REFERENCES poi(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, poi_id)
);