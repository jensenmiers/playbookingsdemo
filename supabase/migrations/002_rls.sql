-- Enable RLS and add policies for all core tables

-- USERS TABLE
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can select/update their own row
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::uuid = id);
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::uuid = id);

-- LISTINGS TABLE
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can select listings (public search)
CREATE POLICY "Public can view listings" ON listings
  FOR SELECT USING (true);
-- Policy: Owners can insert/update/delete their own listings
CREATE POLICY "Owners can manage their listings" ON listings
  FOR ALL USING (auth.uid()::uuid = owner_id);

-- AVAILABILITY TABLE
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can manage availability for their own listings
CREATE POLICY "Owners can manage availability for their listings" ON availability
  FOR ALL USING (
    auth.uid()::uuid = (
      SELECT owner_id FROM listings WHERE listings.id = availability.listing_id
    )
  );

-- BOOKINGS TABLE
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Renters can manage their own bookings
CREATE POLICY "Renters can manage their bookings" ON bookings
  FOR ALL USING (auth.uid()::uuid = renter_id);
-- Policy: Owners can view bookings for their listings
CREATE POLICY "Owners can view bookings for their listings" ON bookings
  FOR SELECT USING (
    auth.uid()::uuid = (
      SELECT owner_id FROM listings WHERE listings.id = bookings.listing_id
    )
  ); 