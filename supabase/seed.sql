-- Seed initial data for development

-- First, ensure we have some test users (these will be created by Supabase Auth)
-- Insert some sample POIs for Dayton, OH

INSERT INTO poi (name, category, description, latitude, longitude, address, status, submitted_by, average_rating, review_count) VALUES
  ('The Oregon District Bars', 'bar', 'Historic district with multiple bars and nightlife venues', 39.7590, -84.1885, 'Oregon District, Dayton, OH', 'approved', NULL, 4.5, 128),
  ('The Dublin Pub', 'bar', 'Irish pub with live music and great atmosphere', 39.7601, -84.1902, '300 Wayne Ave, Dayton, OH 45410', 'approved', NULL, 4.3, 89),
  ('Club Masque', 'club', 'Popular nightclub with multiple dance floors', 39.7582, -84.1923, '34 N Jefferson St, Dayton, OH 45402', 'approved', NULL, 4.0, 67),
  ('Warped Wing Brewing Company', 'brewery', 'Local craft brewery with taproom', 39.7575, -84.1934, '26 Wyandot St, Dayton, OH 45402', 'approved', NULL, 4.7, 203),
  ('Flanagan''s Pub', 'sportsbar', 'Sports bar with many TVs and pub food', 39.7598, -84.1910, '101 E Stewart St, Dayton, OH 45409', 'approved', NULL, 4.2, 145),
  ('The Trolley Stop', 'live_music', 'Venue for local and touring bands', 39.7589, -84.1897, '530 E 5th St, Dayton, OH 45402', 'approved', NULL, 4.4, 92),
  ('Sidebar 10', 'lounge', 'Upscale cocktail lounge', 39.7572, -84.1941, '10 N Ludlow St, Dayton, OH 45402', 'approved', NULL, 4.6, 78),
  ('Rooftop at The Wheelhouse', 'rooftop', 'Rooftop bar with great views', 39.7605, -84.1879, '305 S Patterson Blvd, Dayton, OH 45402', 'approved', NULL, 4.8, 56),
  ('Wine Gallery', 'wine_bar', 'Wine bar with extensive selection', 39.7593, -84.1905, '44 S St Clair St, Dayton, OH 45402', 'approved', NULL, 4.5, 112),
  ('Karaoke Kafe', 'karaoke', 'Karaoke bar with private rooms', 39.7580, -84.1950, '215 E 3rd St, Dayton, OH 45402', 'approved', NULL, 4.1, 45),
  ('Dance Factory', 'dance', 'Dance club with Latin and electronic music', 39.7578, -84.1915, '125 N Main St, Dayton, OH 45402', 'approved', NULL, 4.3, 67),
  ('The Neon Moon', 'bar', 'Retro-themed bar with arcade games', 39.7595, -84.1928, '511 E 3rd St, Dayton, OH 45402', 'approved', NULL, 4.7, 89),
  ('Brew & Cue', 'sportsbar', 'Billiards hall with craft beer', 39.7583, -84.1901, '222 N Jefferson St, Dayton, OH 45402', 'approved', NULL, 4.0, 34),
  ('The Jazz Cellar', 'live_music', 'Intimate jazz club', 39.7600, -84.1893, '409 E 5th St, Dayton, OH 45402', 'approved', NULL, 4.9, 156),
  ('Sky Lounge', 'rooftop', 'Modern rooftop lounge', 39.7610, -84.1885, '600 Main St, Dayton, OH 45402', 'approved', NULL, 4.6, 72);

-- Insert some sample reviews
INSERT INTO reviews (poi_id, user_id, rating, comment) VALUES
  ((SELECT id FROM poi WHERE name = 'Warped Wing Brewing Company'), 
   (SELECT id FROM profiles LIMIT 1), 
   5, 'Amazing craft beers and great atmosphere!'),
  ((SELECT id FROM poi WHERE name = 'The Dublin Pub'), 
   (SELECT id FROM profiles LIMIT 1 OFFSET 1), 
   4, 'Great live music and authentic Irish feel.'),
  ((SELECT id FROM poi WHERE name = 'Sidebar 10'), 
   (SELECT id FROM profiles LIMIT 1), 
   5, 'Best cocktails in Dayton. Upscale but welcoming.');

-- Update POI ratings based on reviews
-- (This happens automatically via trigger, but we'll manually trigger it)
UPDATE poi SET updated_at = NOW() WHERE id IN (
  SELECT DISTINCT poi_id FROM reviews
);