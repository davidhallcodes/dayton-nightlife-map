export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          role: 'admin' | 'moderator' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'admin' | 'moderator' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: 'admin' | 'moderator' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      poi: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          latitude: number
          longitude: number
          address: string | null
          website: string | null
          phone: string | null
          hours: Json | null
          price_level: '$' | '$$' | '$$$' | '$$$$' | null
          yelp_id: string | null
          google_id: string | null
          tripadvisor_id: string | null
          status: 'pending' | 'approved' | 'rejected'
          is_featured: boolean
          featured_until: string | null
          average_rating: number
          review_count: number
          submitted_by: string | null
          submitted_at: string
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          latitude: number
          longitude: number
          address?: string | null
          website?: string | null
          phone?: string | null
          hours?: Json | null
          price_level?: '$' | '$$' | '$$$' | '$$$$' | null
          yelp_id?: string | null
          google_id?: string | null
          tripadvisor_id?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          is_featured?: boolean
          featured_until?: string | null
          average_rating?: number
          review_count?: number
          submitted_by?: string | null
          submitted_at?: string
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          latitude?: number
          longitude?: number
          address?: string | null
          website?: string | null
          phone?: string | null
          hours?: Json | null
          price_level?: '$' | '$$' | '$$$' | '$$$$' | null
          yelp_id?: string | null
          google_id?: string | null
          tripadvisor_id?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          is_featured?: boolean
          featured_until?: string | null
          average_rating?: number
          review_count?: number
          submitted_by?: string | null
          submitted_at?: string
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_poi: {
        Row: {
          user_id: string
          poi_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          poi_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          poi_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          poi_id: string
          user_id: string
          rating: number
          comment: string | null
          photos: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          poi_id: string
          user_id: string
          rating: number
          comment?: string | null
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          poi_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          color: string | null
          display_order: number
          is_active: boolean
        }
        Insert: {
          id: string
          name: string
          icon?: string | null
          color?: string | null
          display_order?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          color?: string | null
          display_order?: number
          is_active?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_nearby_pois: {
        Args: {
          lat: number
          lng: number
          radius_km?: number
          limit_count?: number
        }
        Returns: {
          id: string
          name: string
          category: string
          latitude: number
          longitude: number
          distance_km: number
        }[]
      }
    }
    Enums: {
      user_role: 'admin' | 'moderator' | 'user'
      poi_status: 'pending' | 'approved' | 'rejected'
    }
  }
}