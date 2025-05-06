# Backend Structure Document

## 1. Backend Architecture

### Overall Design
The backend is built on Next.js API routes (serverless functions) and Supabase. It follows a modular, event-driven pattern:

- **Next.js API Routes**: Each logical area (auth, listings, bookings, payments, etc.) lives in its own folder under `/pages/api`. This keeps code organized and easy to extend.
- **Service Layer**: Business logic (e.g., booking validations, availability checks) is encapsulated in separate service modules.
- **Data Access Layer**: All database calls go through a set of helper functions that wrap Supabase client calls. This abstraction simplifies queries and centralizes error handling.
- **Event Hooks & Webhooks**: Stripe webhooks handle payment events; Supabase triggers manage row-level security events.

### Scalability, Maintainability & Performance
- **Serverless Functions** scale automatically with traffic (Vercel). You don’t worry about servers or capacity planning.
- **Supabase** handles database scaling (read replicas, connection pooling) and offloads authentication.
- **Clear Separation of Concerns** makes it easier to maintain and test each piece without affecting others.
- **Caching** at the edge (Vercel) and in-memory (Redis, if needed for sessions) speeds up frequent reads like facility listings.
- **Geospatial Indexes** (PostGIS) ensure location searches stay fast even as data grows.

## 2. Database Management

### Technologies Used
- **PostgreSQL** (via Supabase) with the **PostGIS** extension for geospatial queries.
- **Row-Level Security (RLS)** in Supabase to enforce Role-Based Access Control (RBAC).
- **Supabase Storage** for file uploads (facility photos, insurance documents).

### Data Structure & Access
- Data is organized into tables for users, roles, facilities, availability, bookings, payments, insurance, and notifications.
- **RLS Policies** restrict queries so renters see only their bookings, owners see only their facilities/bookings, and admins see everything.
- **Foreign Keys & Indexes** maintain referential integrity and speed up joins (e.g., facility → bookings).
- **Geospatial Data**: Facility locations are stored as `GEOMETRY(Point)` with a GIST index for radius searches.

## 3. Database Schema

Below is a human-readable summary, followed by the PostgreSQL schema.

### Human-Readable Schema
- **Users**: Contains login credentials and profile info.
- **Roles**: Defines user roles (Admin, FacilityOwner, Renter).
- **UserRoles**: Pivot table linking users to roles (one user, many roles).
- **Facilities**: Info about each court (name, address, geolocation, hourly rate, owner).
- **AvailabilitySlots**: 30-minute time slots for each facility.
- **Bookings**: Reservations made by renters (with status: Pending, Confirmed, Cancelled).
- **Payments**: Stripe payment records tied to bookings.
- **InsuranceRecords**: Uploaded docs or CoverWallet purchase references per booking.
- **Notifications**: Email or SMS logs for confirmations, reminders.

### PostgreSQL Schema (SQL)
```sql
-- Users table
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  hashed_pass   TEXT,
  full_name     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Roles table
CREATE TABLE roles (
  id   SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL  -- Admin, FacilityOwner, Renter
);

-- UserRoles pivot
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id INT  REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Facilities table
CREATE TABLE facilities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID REFERENCES users(id),
  name          TEXT NOT NULL,
  address       TEXT NOT NULL,
  location      GEOMETRY(Point, 4326) NOT NULL,
  hourly_rate   NUMERIC(8,2) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_facilities_location ON facilities USING GIST(location);

-- Availability slots
CREATE TABLE availability_slots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id  UUID REFERENCES facilities(id) ON DELETE CASCADE,
  starts_at    TIMESTAMPTZ NOT NULL,
  ends_at      TIMESTAMPTZ NOT NULL,
  is_blocked   BOOLEAN DEFAULT FALSE
);

-- Bookings table
CREATE TABLE bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id   UUID REFERENCES facilities(id),
  renter_id     UUID REFERENCES users(id),
  slot_id       UUID REFERENCES availability_slots(id),
  status        TEXT CHECK (status IN ('Pending','Confirmed','Cancelled')) DEFAULT 'Pending',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id     UUID REFERENCES bookings(id),
  stripe_charge  TEXT,
  amount         NUMERIC(8,2),
  status         TEXT CHECK (status IN ('Pending','Paid','Refunded')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Insurance records
CREATE TABLE insurance_records (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id     UUID REFERENCES bookings(id),
  coverwallet_id TEXT,
  document_url   TEXT,
  purchased_at   TIMESTAMPTZ
);

-- Notifications table
CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  type         TEXT,  -- e.g., 'BookingConfirmation', 'PasswordReset'
  channel      TEXT,  -- 'Email' or 'SMS'
  sent_at      TIMESTAMPTZ,
  payload      JSONB
);
```  

## 4. API Design and Endpoints

The backend exposes RESTful API endpoints via Next.js API routes. Authentication is JWT-based (via Supabase). Key endpoints:

- **/api/auth/**
  - `POST /login`: User login (email/password or OAuth).
  - `POST /signup`: Create account.
  - `POST /logout`: Invalidate session.

- **/api/users/**
  - `GET /me`: Get current user profile & roles.
  - `PUT /me`: Update profile.

- **/api/facilities/**
  - `GET /`: List/search facilities (with geospatial filters).
  - `POST /`: Create new facility (owners only).
  - `GET /:id`: Get facility details.
  - `PUT /:id`: Update facility info.

- **/api/availability/**
  - `GET /:facilityId`: Fetch slots for a facility.
  - `POST /`: Create or block slots (owners only).

- **/api/bookings/**
  - `POST /`: Create a booking (renter).
  - `GET /`: List user's bookings.
  - `PUT /:id/confirm`: Owner confirms booking.
  - `PUT /:id/cancel`: Renter or owner cancels.

- **/api/payments/**
  - `POST /checkout`: Start Stripe Checkout session.
  - `POST /webhook`: Receive Stripe payment events.

- **/api/insurance/**
  - `POST /upload`: Upload insurance doc to Supabase Storage.
  - `POST /purchase`: Initiate CoverWallet purchase.

- **/api/notifications/**
  - `POST /email`: Send email via SendGrid.
  - `POST /sms`: (future) send SMS via Twilio.

- **/api/admin/**
  - CRUD on users, facilities, bookings (admins only).

## 5. Hosting Solutions

- **Vercel** hosts the Next.js frontend and serverless API routes:
  - Automatic scaling and global edge network.
  - Built-in CDN for static assets.
- **Supabase** (hosted) manages PostgreSQL database, authentication, storage, and real-time features.
- **Third-Party Services**:
  - **Stripe** for payments.
  - **CoverWallet** for insurance.
  - **SendGrid** for emails.
  - **Twilio** for SMS (post-MVP).

_Advantages_: No server maintenance, pay-as-you-grow pricing, built-in redundancy, and global performance.

## 6. Infrastructure Components

- **Load Balancer & CDN**: Vercel’s edge network automatically routes and caches requests globally.
- **Caching Mechanisms**:
  - HTTP caching (Cache-Control headers) for public data (facility listings).
  - In-memory cache (Redis) can be added for session or rate-limit counters.
- **Database Connection Pooling**: Supabase pools connections to optimize concurrent access.
- **Geospatial Indexes**: PostGIS GIST indexes for fast location queries.
- **Webhooks Queue**: Stripe webhooks are received and processed asynchronously to avoid blocking.

## 7. Security Measures

- **Authentication & Authorization**:
  - Supabase Auth issues JWTs for secure, stateless sessions.
  - RLS policies enforce that users can only see or modify permitted rows.
- **Data Encryption**:
  - TLS for all in transit data (HTTPS everywhere).
  - Encryption at rest for database and storage (managed by Supabase).
- **Secure API Practices**:
  - Input validation and sanitization on every endpoint.
  - Rate limiting on sensitive routes (e.g., login).
  - CORS policy restricted to our frontend domain.
- **Payment Security**:
  - Sensitive card data never touches our servers (handled by Stripe Checkout).
  - Webhook signature verification to prevent spoofing.
- **Third-Party Credentials**:
  - Stored securely in environment variables.
  - Rotated regularly.

## 8. Monitoring and Maintenance

- **Performance Monitoring**:
  - Vercel Analytics for request latencies and errors.
  - Supabase dashboard for query performance and database health.
- **Error Tracking**:
  - Integrate Sentry (or similar) to capture uncaught exceptions in serverless functions.
- **Logging**:
  - Unified logs (Vercel + Supabase) aggregated in Logflare or Papertrail.
- **Maintenance Strategy**:
  - Regular dependency updates and security patching.
  - Automated database migrations via Supabase CLI.
  - Scheduled backups and restore drills.
  - Code reviews and CI/CD checks on every pull request.

## 9. Conclusion and Overall Backend Summary
The backend for the indoor basketball court marketplace is a modern, serverless architecture built on Next.js API routes and Supabase. It leverages PostgreSQL with PostGIS for powerful geospatial queries, Stripe and CoverWallet for payments and insurance, and Supabase Auth with RLS for secure role-based access. Hosting on Vercel and Supabase offers automatic scaling, global performance, and minimal infrastructure overhead. With this setup, the platform can grow seamlessly, maintain high performance, and keep user data secure—all while providing a clear path for future enhancements (SMS notifications, advanced analytics, etc.).