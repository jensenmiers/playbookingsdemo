export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  user_type: 'renter' | 'owner' | 'admin';
  bio: string | null;
  preferred_location: string | null;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'pro' | null;
  age_range: 'under_18' | '18_25' | '26_35' | '36_45' | '46_plus' | null;
  business_name: string | null;
  business_license: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    provider?: string;
  };
}

export interface Listing {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  address: string;
  court_type: string;
  hourly_rate: number;
  daily_rate: number | null;
  photos: string[];
  amenities: string[];
  rules: Record<string, boolean>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  listing_id: string;
  renter_id: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
} 