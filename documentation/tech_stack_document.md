# Tech Stack Document

This document explains, in clear everyday language, the technology choices for our sports facility rental marketplace. It covers why each tool was selected and how it helps build a beautiful, reliable, and user-friendly application.

## Frontend Technologies

We’ve chosen a modern, component-driven frontend to deliver a fast, interactive experience:

- **React & Next.js 14**  
  Why: React lets us build reusable UI components. Next.js adds built-in routing, server-side rendering (SSR), and API routes so public pages (like court listings) load quickly and rank well in search engines.

- **Tailwind CSS & shadcn/ui**  
  Why: Tailwind’s utility-first classes make styling consistent and flexible. shadcn/ui provides pre-built, accessible React components that match our Tailwind theme (colors, fonts, borders), speeding up development.

- **FullCalendar**  
  Why: Displays availability in an intuitive drag-and-drop calendar. Renters see open slots, and owners can quickly set or adjust their schedule in 30-minute increments.

- **Google Maps JavaScript API**  
  Why: Powers the map-and-list search interface. Users can pan a map, set a search radius, and see courts sorted by distance—making it easy to find nearby indoor basketball gyms.

## Backend Technologies

Our backend stack handles data, business logic, and integrations securely and at scale:

- **Next.js API Routes**  
  Why: Small serverless functions live alongside the frontend. They handle bookings, messaging, insurance uploads, and webhook events without a separate server.

- **Supabase (PostgreSQL + Auth + Row-Level Security)**  
  Why: Supabase offers a hosted PostgreSQL database plus built-in user authentication. Row-level security (RLS) enforces role-based access (admin, facility owner, renter) right in the database, keeping data safe.

- **PostgreSQL Geospatial Extensions**  
  Why: Enables fast location searches using bounding-box filters. Combined with Google Maps queries, it powers distance-based sorting and map updates.

- **Stripe & Stripe Connect**  
  Why: Manages secure card payments, authorization holds, captures on owner approval, refunds, and payouts. Connect onboarding lets each gym owner receive funds directly.

- **CoverWallet Embedded Widget**  
  Why: Lets renters purchase or upload their Certificate of Insurance (COI) during booking without leaving the app.

- **SendGrid**  
  Why: Sends transactional emails—booking confirmations, status updates, password resets—reliably and at scale.

- **Twilio (Planned)**  
  Why: Will add SMS and push notifications in a future phase to keep users informed in real time.

## Infrastructure and Deployment

We’ve picked platforms and processes that ensure smooth development, reliable uptime, and easy scaling:

- **Version Control: Git & GitHub**  
  Why: Tracks code changes, enables collaboration, and powers automated workflows.

- **CI/CD: GitHub Actions**  
  Why: Automatically runs tests and deploys to production or preview environments whenever code is merged, ensuring stability and quick feedback.

- **Hosting: Vercel**  
  Why: Optimized for Next.js projects, offering zero-config deployments, global edge caching, and instant rollbacks.

- **Database Hosting: Supabase**  
  Why: Managed PostgreSQL with daily backups, automatic updates, and monitoring—no DBA required.

- **Environment Management**  
  Why: Secrets (API keys, database URLs) live safely in environment variables on Vercel and Supabase, keeping credentials out of code.

## Third-Party Integrations

We tap into specialized services so we can focus on core features:

- **Stripe & Stripe Connect** – secure payments and payouts
- **SendGrid** – transactional email delivery
- **Google Maps JavaScript API** – interactive maps and geolocation
- **FullCalendar** – scheduling UI
- **CoverWallet** – embedded insurance purchase widget
- **Twilio** (future) – SMS/push alerts
- **iCal Endpoints** – two-way calendar sync with Google Calendar and Outlook

These integrations deliver rich functionality without reinventing the wheel.

## Security and Performance Considerations

We’ve built in safeguards and optimizations so users enjoy a smooth, safe experience:

- **Authentication & Access Control**  
  - Supabase Auth handles sign-up/login via email, Google, or SSO.  
  - Row-level security ensures users only see or change data they’re allowed to.

- **Data Protection**  
  - All traffic is encrypted (HTTPS).  
  - Sensitive data (payment details, COIs) is stored securely and only accessible by authorized roles.

- **API Validation**  
  - Next.js API routes validate inputs and sanitize requests to prevent malicious data.

- **Performance Optimizations**  
  - Server-side rendering (SSR) and incremental static regeneration (ISR) for public pages speed up load times.  
  - Edge caching on Vercel delivers assets from servers closest to users.  
  - Database indexes (including geospatial indexes) keep searches fast even as listings grow.

## Developer Tools

To keep our workflow efficient and code quality high, we use:

- **Cursor IDE** (AI-powered coding assistant)  
- **Claude 3.7 Sonnet & GPT-4o** (for advanced code suggestions and reasoning)  
- **ESLint & Prettier** (code style enforcement and automatic formatting)

These tools help the team code faster and maintain consistency.

## Conclusion and Overall Tech Stack Summary

Our technology choices align perfectly with project goals:

- **User Experience**: React, Next.js, Tailwind, shadcn/ui, and FullCalendar deliver a fast, attractive, and intuitive interface.
- **Functionality**: Supabase with PostgreSQL and RLS, plus Next.js API routes, power bookings, role management, and data security.
- **Reliability & Scalability**: Vercel and Supabase hosting, backed by automated CI/CD, ensure the app stays up and scales with demand.
- **Integrations**: Stripe, SendGrid, Google Maps, CoverWallet, and Twilio seamlessly add payments, emails, maps, insurance, and notifications.

Unique strengths include a fully integrated frontend/backend with Next.js, strong database security via Supabase RLS, and a vibrant retro-Gatorade design implemented through Tailwind and shadcn/ui. Together, they create a platform we can proudly demo to friends and users alike!
