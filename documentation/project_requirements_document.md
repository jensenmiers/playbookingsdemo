# Project Requirements Document (PRD)

## 1. Project Overview

This project is a modern online marketplace where sports facility owners—specifically private schools and corporate/independent basketball gyms—can list indoor basketball courts for rent, and renters (teams, coaches, leagues, individuals) can discover, reserve, and insure time slots. The platform highlights a retro “Gatorade-inspired” look and feel, combining a split map/list view for easy discovery with a drag-and-drop calendar interface for availability management. Renters can upload or purchase insurance, pay securely, and manage bookings, while owners approve requests, view insurance certificates, and receive payouts.

We’re building this to solve the fragmented, offline nature of renting private indoor courts. The MVP success criteria are:

*   A seamless renter flow (search → book → insure → pay → dashboard).
*   A clear owner flow (list → schedule → approve → payout).
*   A polished, on-brand UI showcasing core functionality.
*   Stable core integrations (maps, calendar, payments, insurance widget).

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1 MVP)

*   User authentication & role management via Supabase Auth (email, Google SSO).
*   Facility listing wizard (details, photos, rules, hourly rate).
*   Availability calendar using FullCalendar + shadcn/ui (30-min slots, CRUD).
*   Location search with Google Maps JavaScript API & Postgres geospatial queries.
*   Split map/list UI for search results, sorted by distance.
*   Booking workflow: select slot, upload/purchase COI (CoverWallet embed), request reservation.
*   Payment processing: Stripe Checkout for holds, captures, refunds; Stripe Connect onboarding & payouts.
*   Renter dashboard: upcoming/past bookings, insurance docs, cancellation logic.
*   Owner dashboard: incoming requests, insurance certificate viewer, approve/decline logic, block dates.
*   Transactional emails via SendGrid (confirmations, password resets).
*   Tailwind + shadcn/ui styling with retro Gatorade theme tokens (colors, fonts, motifs).

### Out-of-Scope (Phase 2+)

*   SMS/push notifications (Twilio).
*   Two-way calendar sync (Google/Outlook).
*   User reviews & ratings.
*   ACH, Apple Pay, or alternative payment methods.
*   Advanced admin modules beyond basic React-Admin scaffolding.
*   Mobile apps (native iOS/Android).
*   Multi-language support.
*   Analytics/dashboard reporting.

## 3. User Flow

**Renter Journey**\
A new user lands on the homepage, sees a location/date-time picker above a split map/list view. They enter a location or allow geolocation, pick desired date/time, and results update with court cards showing thumbnails, distance, and mini-calendars. Clicking a card opens the detail page: full photo carousel, amenities, rules, and the interactive FullCalendar availability grid. The renter selects an open slot, chooses to upload their own Certificate of Insurance or purchase via the embedded CoverWallet widget, and proceeds to Stripe Checkout. After payment, the booking is “Pending Approval,” and the renter is redirected to their dashboard where they can view upcoming reservations, insurance docs, and cancel within allowed windows.

**Facility Owner Journey**\
An owner signs up/logs in via Supabase Auth, completes their profile, and launches the “Create Listing” wizard. They enter court name/address, upload photos, set amenities, rules, and hourly rate. Next, they drag blocks on the FullCalendar component to define availability in 30-minute increments. After connecting a Stripe account through Stripe Connect onboarding, the listing goes live. Incoming booking requests appear in the owner dashboard; the owner reviews the attached COI, approves or declines (auto-capture or auto-refund via Stripe), blocks additional dates if needed, and views payouts in real time.

## 4. Core Features

*   **Authentication & Role Management**\
    Supabase Auth, RLS-based role flags (renter, owner, admin).
*   **Listing Wizard**\
    Multi-step form for court details, photo uploads, rules, pricing.
*   **Availability Calendar**\
    FullCalendar + shadcn/ui for owners (edit mode) and renters (read-only).
*   **Location-Based Search**\
    Google Maps JS API + Postgres geospatial queries; radius & bounding-box filters.
*   **Split Map/List UI**\
    Interactive map synced with listing cards; distance sort.
*   **Booking & Insurance**\
    Slot selection, COI upload or CoverWallet embedded purchase.
*   **Payments & Payouts**\
    Stripe Checkout for payment holds/​captures, Stripe Connect for owner payouts.
*   **Dashboards**\
    Renter: manage bookings, insurance docs, cancellation.\
    Owner: review requests, view COIs, approve/decline, block slots, track payouts.
*   **Notifications**\
    Email via SendGrid for confirmations, reminders, resets.
*   **Branding & Theming**\
    Tailwind theme tokens for colors, typography, iconic motifs.

## 5. Tech Stack & Tools

*   Frontend\
    • React (with Next.js 14) for SSR/ISR & file-based routing\
    • Tailwind CSS + shadcn/ui for UI components\
    • FullCalendar for availability UI\
    • Google Maps JavaScript API for map & geo search
*   Backend & Data\
    • Next.js API routes (Node.js)\
    • Supabase (Auth, Postgres, RLS, Storage)\
    • PostgreSQL with PostGIS extensions
*   Payments & Insurance\
    • Stripe & Stripe Connect\
    • CoverWallet embedded widget for insurance purchase
*   Notifications\
    • SendGrid (MVP)\
    • Twilio (planned)
*   Dev Tools & AI Assistants\
    • Cursor IDE (AI-powered coding)\
    • Claude 3.7 Sonnet, GPT-4o for code generation & review

## 6. Non-Functional Requirements

*   **Performance**\
    • Homepage load ≤ 2 s (cold).\
    • Calendar interactions < 500 ms.\
    • Map tile & search response < 1 s.
*   **Security & Compliance**\
    • HTTPS everywhere, data encryption at rest/in transit.\
    • PCI DSS compliance via Stripe Checkout.\
    • RBAC & Supabase RLS to prevent unauthorized access.
*   **Usability & Accessibility**\
    • WCAG 2.1 AA color contrast.\
    • Mobile-responsive breakpoints.\
    • Keyboard navigation for core flows.
*   **Scalability**\
    • Horizontal scaling via Vercel/Node micro-services.\
    • Postgres indexing on geo columns.

## 7. Constraints & Assumptions

*   Next.js 14 is the single full-stack framework (no separate Express server).
*   Supabase and Postgres must support geospatial queries (PostGIS).
*   Google Maps API key with sufficient quota.
*   CoverWallet provides an embeddable widget (CORS-friendly).
*   Stripe Connect supports payouts in target regions.
*   Users have modern browsers (ES6+, CSS Grid/Flex).
*   Internet connectivity required for map/calendar assets.

## 8. Known Issues & Potential Pitfalls

*   **Google Maps Quota Limits**\
    Mitigation: Implement client-side caching, restrict map load to search screens, monitor usage.
*   **Geospatial Query Performance**\
    Mitigation: Add PostGIS indexes; paginate results; bounding-box pre-filters.
*   **Calendar Sync & Race Conditions**\
    Mitigation: Lock slots on selection, timestamp-based conflict checks, webhook retries.
*   **Supabase RLS Complexity**\
    Mitigation: Maintain clear policy docs; write unit tests for row-level rules.
*   **Embedding CoverWallet**\
    Mitigation: Confirm widget supports cross-origin embedding; fallback to link if blocked.
*   **Stripe Onboarding Errors**\
    Mitigation: Provide clear error messaging; support manual document upload.
*   **Email Deliverability**\
    Mitigation: Set up SPF/DKIM/SPF records; monitor bounce rates.

*This PRD provides a crystal-clear foundation for subsequent technical documents—frontend guidelines, backend structure, flowcharts, security guides, and IDE rules—ensuring the AI model can generate unambiguous implementation plans.*
