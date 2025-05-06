# Implementation Plan for Sports Facility Rental Marketplace

This plan outlines a phased approach (8 two-week sprints) to build the MVPs for Renters and Gym Owners, incorporating security-by-design principles throughout. Each sprint includes key tasks, deliverables, and security checkpoints.

---

## Sprint 1 (Weeks 1–2): Project Setup & Authentication

### Objectives
- Establish codebase, environments, and CI/CD pipelines
- Implement user authentication and RBAC

### Tasks
- Initialize Next.js 14 monorepo with Tailwind CSS and shadcn/ui
- Configure Git repository with branch protection and lockfile (`package-lock.json`)
- Set up Supabase project: Auth, PostgreSQL, Storage buckets
- Define RBAC roles (Admin, FacilityOwner, Renter) and implement Supabase RLS policies
- Implement Supabase Auth (email/password, Google OAuth, SSO) in Next.js API routes
- Create secure session management (HTTP-Only, Secure, SameSite cookies)
- Write automated tests for login, signup, role assignment

### Deliverables
- Git repository with CI pipeline (Lint, SCA scan, tests)
- Auth API endpoints and UI flow
- RBAC enforcement demos

### Security Checkpoints
- Enforce secure defaults in Supabase (disable public table access)
- Validate all inputs server-side (zod/schema validation)
- Secrets managed via environment variables and CI secrets store

---

## Sprint 2 (Weeks 3–4): Listing Wizard & Storage

### Objectives
- Build facility listing creation flow for Gym Owners
- Integrate image uploads securely

### Tasks
- Design and implement multi-step Listing Wizard UI (court details, pricing, rules)
- Integrate Supabase Storage for photo uploads (presigned URLs, file-type & size validation)
- Store listing metadata in PostgreSQL with PostGIS geometry column for location
- Server-side validation for all form inputs
- Implement image thumbnails and lazy loading

### Deliverables
- Functional Listing Wizard with CRUD operations
- Supabase Storage integration with secure upload policy
- Unit tests for listing creation and validation

### Security Checkpoints
- Sanitize file names and validate MIME types
- Restrict storage bucket permissions to owner role
- Enforce HTTPS file upload URLs

---

## Sprint 3 (Weeks 5–6): Availability Calendar Integration

### Objectives
- Introduce FullCalendar for availability management
- Implement time-slot CRUD with RBAC

### Tasks
- Install and configure FullCalendar in React
- Owner: create, edit, delete 30-minute availability slots
- Renter: view-only calendar overlay
- Persist time slots in PostgreSQL table with foreign keys to listings
- Enforce RLS policies on time slots
- Add server-side and client-side validation (no overlapping slots)

### Deliverables
- Interactive calendar UI for owners and renters
- API routes for slot management with authorization
- Integration tests covering slot operations

### Security Checkpoints
- Validate date/time ranges on server
- Prevent cross-site scripting via calendar event titles
- CSP header to restrict script sources

---

## Sprint 4 (Weeks 7–8): Location Search & Map Integration

### Objectives
- Implement geospatial search with PostGIS
- Integrate Google Maps JavaScript API

### Tasks
- Extend listings table with `geography(Point, 4326)` column
- Write server-side API for radius and bounding-box queries (limit results, pagination)
- Integrate Google Maps in UI with markers and list view sync
- Implement search form: address autocomplete, radius slider
- Sort by distance on server

### Deliverables
- Location-based search endpoint with parameterized queries
- Map/List responsive UI component
- End-to-end tests for search behavior

### Security Checkpoints
- Restrict Google Maps API key via HTTP referrers
- Validate user-provided coordinates and input lengths
- Rate limit search API to prevent abuse

---

## Sprint 5 (Weeks 9–10): Booking Workflow & Insurance Handling

### Objectives
- Enable slot booking and COI upload/purchase
- Track booking states (“pending” → approved/declined)

### Tasks
- Build booking API: create pending bookings, link to user, listing, slot
- Renter UI: select slot, upload COI (PDF/image) or embed CoverWallet widget securely
- Owner UI: view pending bookings, approve or decline
- Store COI in Supabase Storage with access control
- Email notifications via SendGrid (confirmation, status updates)

### Deliverables
- Booking management endpoints and UI flows
- COI upload/purchase integration
- Notification templates and test emails

### Security Checkpoints
- Validate file content (PDF only) and size limits for COIs
- Enforce authorization on booking actions (RLS + server checks)
- Encrypt emails in transit (TLS) and avoid PII leakage in logs

---

## Sprint 6 (Weeks 11–12): Payments & Payouts

### Objectives
- Integrate Stripe Checkout and Stripe Connect
- Handle payment holds, captures, refunds, and owner payouts

### Tasks
- Configure Stripe products/prices and Connect accounts
- Implement Checkout sessions for renters with hold & capture flows
- Webhook endpoints to update booking status on payment events
- Payout dashboard for owners (balance, transfer history)
- Test refund and dispute flows

### Deliverables
- Secure payment API routes and UI components
- Webhook handlers with signature verification
- Owner payout management page

### Security Checkpoints
- Use Stripe best practices (Idempotency keys, signature verification)
- PCI compliance via Stripe Checkout (no card data stored)
- Limit webhook endpoint exposure and use HMAC validation

---

## Sprint 7 (Weeks 13–14): Notifications & Admin Panel

### Objectives
- Expand notification channels (SMS placeholder)
- Build Admin panel for system oversight

### Tasks
- Integrate Twilio (sandbox) for SMS notifications (booking reminders)
- Develop Admin panel using React-Admin or custom Next.js UI
  - User, Listing, Booking management
- Implement search, filters, role assignment, audit logs
- Harden API routes for admin actions

### Deliverables
- SMS notification module (configurable templates)
- Admin panel with secure login and RBAC
- Audit logs stored in PostgreSQL

### Security Checkpoints
- Enforce MFA for admin accounts
- Secure CORS and rate limiting on admin APIs
- Mask sensitive fields in admin views (PII hiding)

---

## Sprint 8 (Weeks 15–16): UI Polish, Testing & Launch

### Objectives
- Finalize retro branding and UX polishing
- Complete end-to-end testing, performance tuning, and security review

### Tasks
- Apply final theme (colors, typography, icons) consistently
- Implement cookie banners, privacy policy, terms of service
- Conduct accessibility audit (WCAG 2.1 AA)
- Run SCA scan, dependency updates, vulnerability fixes
- Perform penetration testing and code review
- Deploy to production (Vercel/Netlify + managed database)
- Enable HTTPS with HSTS, secure headers

### Deliverables
- Fully themed, responsive UI
- QA report (unit, integration, E2E test coverage)
- Security assessment summary and remediation
- Go-live announcement plan

### Security Checkpoints
- Enable security headers (`CSP`, `HSTS`, `X-Frame-Options`)
- Rotate production secrets and audit access
- Set up monitoring and alerting (error rates, suspicious activity)

---

# Ongoing Activities

- **DevOps & CI/CD:** Automated builds, tests, and deployments on every PR
- **Dependency Management:** Monthly SCA scans and dependency updates
- **Monitoring & Logging:** Centralized logging, error tracking, and performance metrics
- **Compliance:** Review GDPR/CCPA data handling and user consent mechanisms
- **User Feedback:** Collect analytics and user feedback for continuous improvement

> This implementation plan ensures a secure, robust, and user-focused MVP delivery for both Renters and Gym Owners, setting the foundation for future enhancements and scaling.