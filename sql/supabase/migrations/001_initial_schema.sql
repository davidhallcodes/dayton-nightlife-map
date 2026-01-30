-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE poi_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,20}$'),
  CONSTRAINT display_name_length CHECK (LENGTH(display_name) <= 50),
  CONSTRAINT bio_length CHECK (LENGTH(bio) <= 500)
);

-- Points of Interest table
CREATE TABLE poi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  website TEXT,
  phone TEXT,
  hours JSONB,
  price_level TEXT CHECK (price_level IN ('$', '$$', '$$$', '$$$$')),
  
  -- External IDs
  yelp_id TEXT,
  google_id TEXT,
  tripadvisor_id TEXT,
  
  -- Status and metadata
  status poi_status DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  
  -- Ratings
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- User submission info
  submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Approval info
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_coordinates CHECK (
    latitude BETWEEN -90 AND 90 AND 
    longitude BETWEEN -180 AND 180
  ),
  CONSTRAINT name_length CHECK (LENGTH(name) <= 100),
  CONSTRAINT description_length CHECK (LENGTH(description) <= 500)
);

-- Saved POIs (user favorites)
CREATE TABLE saved_poi (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  poi_id UUID REFERENCES poi(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  PRIMARY KEY (user_id, poi_id)
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poi_id UUID REFERENCES poi(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  photos TEXT[], -- Array of photo URLs
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  UNIQUE(poi_id, user_id),
  CONSTRAINT comment_length CHECK (LENGTH(comment) <= 1000)
);

-- Categories reference table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Insert default categories
INSERT INTO categories (id, name, icon, color, display_order) VALUES
  ('bar', 'Bars', 'FaBeer', 'bg-blue-500', 1),
  ('club', 'Clubs', 'FaMusic', 'bg-purple-500', 2),
  ('lounge', 'Lounges', 'FaCocktail', 'bg-pink-500', 3),
  ('brewery', 'Breweries', 'FaBeer', 'bg-amber-600', 4),
  ('sportsbar', 'Sports Bars', 'FaTv', 'bg-green-500', 5),
  ('karaoke', 'Karaoke', 'FaMicrophone', 'bg-red-500', 6),
  ('live_music', 'Live Music', 'FaGuitar', 'bg-yellow-500', 7),
  ('dance', 'Dance Clubs', 'FaUsers', 'bg-indigo-500', 8),
  ('rooftop', 'Rooftop', 'FaUmbrella', 'bg-teal-500', 9),
  ('wine_bar', 'Wine Bars', 'FaWineGlassAlt', 'bg-rose-500', 10);

-- Indexes for performance
CREATE INDEX idx_poi_location ON poi(latitude, longitude);
CREATE INDEX idx_poi_category ON poi(category);
CREATE INDEX idx_poi_status ON poi(status);
CREATE INDEX idx_poi_submitted_by ON poi(submitted_by);
CREATE INDEX idx_reviews_poi_id ON reviews(poi_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_saved_poi_user_id ON saved_poi(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE poi ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_poi ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all profiles, update own profile
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- POI: Everyone can view approved POIs, authenticated users can create
CREATE POLICY "Approved POIs are viewable by everyone" 
  ON poi FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can submit POIs" 
  ON poi FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own POI submissions" 
  ON poi FOR UPDATE USING (
    auth.uid() = submitted_by AND 
    status = 'pending'
  );

-- Admins can do everything
CREATE POLICY "Admins have full access" 
  ON poi FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- Saved POI: Users can manage their own favorites
CREATE POLICY "Users can view own saved POIs" 
  ON saved_poi FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save POIs" 
  ON saved_poi FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave POIs" 
  ON saved_poi FOR DELETE USING (auth.uid() = user_id);

-- Reviews: Users can manage their own reviews
CREATE POLICY "Reviews are viewable by everyone" 
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" 
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" 
  ON reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" 
  ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Functions

-- Update POI rating when review is added/updated
CREATE OR REPLACE FUNCTION update_poi_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE poi
  SET 
    average_rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM reviews
      WHERE poi_id = NEW.poi_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE poi_id = NEW.poi_id
    ),
    updated_at = NOW()
  WHERE id = NEW.poi_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for review changes
CREATE TRIGGER update_poi_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_poi_rating();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poi_updated_at
BEFORE UPDATE ON poi
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get nearby POIs
CREATE OR REPLACE FUNCTION get_nearby_pois(
  lat DECIMAL,
  lng DECIMAL,
  radius_km INTEGER DEFAULT 5,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.category,
    p.latitude,
    p.longitude,
    (6371 * acos(
      cos(radians(lat)) * cos(radians(p.latitude)) *
      cos(radians(p.longitude) - radians(lng)) +
      sin(radians(lat)) * sin(radians(p.latitude))
    ))::DECIMAL(10,2) as distance_km
  FROM poi p
  WHERE p.status = 'approved'
    AND (6371 * acos(
      cos(radians(lat)) * cos(radians(p.latitude)) *
      cos(radians(p.longitude) - radians(lng)) +
      sin(radians(lat)) * sin(radians(p.latitude))
    )) <= radius_km
  ORDER BY distance_km
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;