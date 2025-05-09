-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text, -- optional
  profile_image text, -- URL to profile image
  photos text[], -- array of photo URLs
  role text CHECK (role IN ('Admin','FacilityOwner','Renter')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Listings table
CREATE TABLE listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  location geography(Point,4326) NOT NULL,
  amenities text[], -- array of amenity names
  photos text[], -- array of photo URLs
  hourly_rate numeric(10,2),
  daily_rate numeric(10,2),
  insurance_required boolean DEFAULT false,
  metadata jsonb, -- flexible metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Availability table
CREATE TABLE availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  renter_id uuid REFERENCES users(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')) NOT NULL,
  stripe_payment_id text,
  cancellation_reason text,
  insurance_status text, -- e.g., 'required', 'purchased', 'waived'
  payout_status text, -- e.g., 'pending', 'paid', 'failed'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
); 