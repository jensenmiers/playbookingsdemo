# Implementation plan

## Phase 1: Environment Setup

1. **Prevalidation**: Verify current directory is a Git repository or contains a Next.js project (`package.json`, `.git/`). If not, run `git init` to initialize a new repo. (Ref: Project Summary)
2. **Check Node.js**: Confirm Node.js v20.2.1 is installed. If not, install it from https://nodejs.org/dist/v20.2.1/ (Ref: Tech Stack: Frontend).
   - **Validation**: Run `node -v` and expect `v20.2.1`.
3. **Install pnpm**: Run `npm install -g pnpm@latest` for consistent package management. (Ref: Dev Tools)
4. **Initialize Next.js 14 app**: Run `pnpm create next-app@14 my-app --typescript --eslint` in project root (Ref: Tech Stack: Frontend).
   - **Validation**: Confirm `next` dependency at version `14.x.x` in `package.json`.
5. **Create cursor_metrics.md**: In project root, `touch cursor_metrics.md` (Ref: Dev Tools: Cursor).
6. **Add cursor project rules**: Refer to `cursor_project_rules.mdc` to populate `cursor_metrics.md` per guidelines. (Ref: Dev Tools: Cursor)
7. **Set up Supabase MCP for Cursor**:
   1. Create `.cursor` directory: `mkdir -p .cursor` (Ref: Tech Stack: Backend).
   2. Create `.cursor/mcp.json`: `touch .cursor/mcp.json` and add it to `.gitignore`. (Ref: Dev Tools: Cursor)
   3. Insert macOS & Windows configurations in `.cursor/mcp.json`:
       ```json
       {
         "mcpServers": {
           "supabase": {
             "command": "npx",
             "args": ["-y", "@modelcontextprotocol/server-postgres", "<connection-string>"]
           }
         }
       }
       ```
   4. Display link for connection string: https://supabase.com/docs/guides/getting-started/mcp#connect-to-supabase-using-mcp (Ref: Tech Stack: Backend)
   5. After user obtains `<connection-string>`, replace placeholder in `.cursor/mcp.json` and run `npx @modelcontextprotocol/server-postgres <connection-string>`.
   6. Navigate to Cursor Settings > MCP and confirm green active status. (Ref: Dev Tools: Cursor)

## Phase 2: Frontend Development

8. **Install UI dependencies**: In project root, run:
    ```bash
    pnpm add tailwindcss@3.4.0 postcss autoprefixer
    pnpm add @shadcn/ui react-calendar fullcalendar@6.1.8 @fullcalendar/react
    ```
   (Ref: Tech Stack: Frontend)
9. **Configure Tailwind CSS**: Run `npx tailwindcss init -p` to create `tailwind.config.js` and `postcss.config.js`. Update `tailwind.config.js` with content paths pointing to `./src/**/*.{js,ts,jsx,tsx}`. (Ref: Tech Stack: Frontend)
   - **Validation**: Import Tailwind directives in `./src/styles/globals.css` and confirm utility classes compile.
10. **Set up shadcn/ui**: Run `pnpm exec shadcn-ui init` and follow prompts to integrate components (Ref: Tech Stack: Frontend).
11. **Configure Google Maps**: In `/src/lib/google-maps.ts`, export loader function using API key from environment variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Ref: Project Summary: Location-Based Search).
12. **Implement multi-step Listing Wizard**:
    1. Create `/src/components/ListingWizard/Step1Details.tsx` for court details form. (Ref: Project Summary: Facility Listing)
    2. Create `/src/components/ListingWizard/Step2Photos.tsx` for photo uploads using Next.js `Image` and Supabase Storage. (Ref: Project Summary: Facility Listing).
    3. Create `/src/components/ListingWizard/Step3Amenities.tsx` for amenities and rules toggles with Tailwind UI forms. (Ref: Project Summary: Facility Listing).
    4. Create `/src/components/ListingWizard/Step4Pricing.tsx` for hourly rates input with validation. (Ref: Q&A: Form Handling).
    5. Create `/src/components/ListingWizard/WizardLayout.tsx` to orchestrate steps and state. (Ref: Project Summary: Facility Listing).
    - **Validation**: Add unit tests in `/tests/ListingWizard.test.tsx`, run `pnpm test`.
13. **Integrate FullCalendar**:
    1. Create `/src/components/AvailabilityCalendar.tsx` that imports `@fullcalendar/react` and `@fullcalendar/daygrid` for owners (CRUD) and read-only view for renters. (Ref: Project Summary: Availability Calendar).
    2. Fetch availability data via API route `/api/availability?listingId=` (to be created). (Ref: App Flow)
    - **Validation**: Render calendar with mock events and confirm DOM elements.
14. **Implement Location Search UI**:
    1. Create `/src/components/SearchMap.tsx` with Google Maps split view and list. (Ref: Project Summary: Location-Based Search).
    2. Add radius input and bounding-box filter controls above map. (Ref: Project Summary: Location-Based Search).
    - **Validation**: Simulate search with hardcoded lat/lng and confirm markers appear.

## Phase 3: Backend Development

15. **Install Supabase CLI**: Run `npm install -g supabase` (Ref: Tech Stack: Backend).
16. **Initialize Supabase project locally**: `supabase init --project-ref your-ref` in project root. (Ref: Tech Stack: Backend).
17. **Configure Supabase Auth**: In `supabase/config.toml`, enable email, Google, and SSO providers with credentials from environment variables. (Ref: Project Summary: User Authentication).
18. **Define PostgreSQL schema with PostGIS**: In `supabase/migrations/001_init.sql`, create tables:
    ```sql
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE TABLE users (id uuid PRIMARY KEY, email text UNIQUE, role text CHECK (role IN ('Admin','FacilityOwner','Renter')));
    CREATE TABLE listings (id uuid PRIMARY KEY, owner_id uuid REFERENCES users(id), name text, description text, location geography(Point,4326), ...);
    CREATE TABLE availability (id uuid PRIMARY KEY, listing_id uuid REFERENCES listings(id), start timestamptz, end timestamptz);
    CREATE TABLE bookings (id uuid PRIMARY KEY, listing_id uuid REFERENCES listings(id), renter_id uuid REFERENCES users(id), start timestamptz, end timestamptz, status text, stripe_payment_id text);
    ```
    (Ref: Tech Stack: Backend)
19. **Apply migrations via Supabase MCP**: Run `npx @modelcontextprotocol/server-postgres <connection-string> supabase/migrations/001_init.sql` (Ref: Phase 1 Step 7).
20. **Implement API route: POST `/api/listings`**:
    1. Create `/pages/api/listings/index.ts` to accept multi-part JSON with details, photos (URLs), amenities, pricing. (Ref: Project Summary: Facility Listing).
    2. Validate owner role via Supabase JWT and RLS. (Ref: Project Summary: User Authentication).
    - **Validation**: Test with `curl -X POST http://localhost:3000/api/listings` and mock payload.
21. **Implement API route: GET `/api/listings`** for search:
    1. Create `/pages/api/listings/search.ts` that accepts `lat`, `lng`, `radius` params.
    2. Use PostGIS `ST_DWithin` on `location` column for geospatial filter and `ST_MakeEnvelope` for bounding-box. (Ref: Project Summary: Location-Based Search).
    - **Validation**: Run `curl 'http://localhost:3000/api/listings/search?lat=...&lng=...&radius=5'` and verify JSON response.
22. **Implement availability endpoints**:
    1. POST `/api/availability` in `/pages/api/availability/index.ts` for owner CRUD. (Ref: Project Summary: Availability Calendar).
    2. GET `/api/availability?listingId=` in `/pages/api/availability/[listingId].ts`. (Ref: Project Summary: Availability Calendar).
    - **Validation**: Use Postman to create and retrieve availability slots.
23. **Integrate Stripe for Payments & Connect**:
    1. Install Stripe SDK: `pnpm add stripe@12.2.0`. (Ref: Tech Stack: Payment).
    2. Create `/pages/api/payments/checkout.ts` to initiate Stripe Checkout Session with hold and Connect transfer for owner. (Ref: Project Summary: Payments & Payouts).
    - **Validation**: Trigger checkout session and confirm URL in response.
24. **Embed CoverWallet widget for insurance**:
    1. In `/src/components/InsuranceWidget.tsx`, load CoverWallet JS snippet. (Ref: Project Summary: Booking Workflow).
    - **Validation**: Confirm widget loads in development UI.
25. **Configure SendGrid for emails**:
    1. Install `@sendgrid/mail`: `pnpm add @sendgrid/mail@7.7.0`. (Ref: Tech Stack: Notifications).
    2. In `/lib/email.ts`, export helper that sends booking confirmations and password resets. (Ref: Project Summary: Notifications).
    - **Validation**: Send a test email to verify SendGrid integration.

## Phase 4: Integration

26. **Wire Listing Wizard to API**: In `WizardLayout.tsx`, call `POST /api/listings` on final step to create listing. (Ref: App Flow: Facility Owner).
27. **Fetch availability in calendar**: In `AvailabilityCalendar.tsx`, use `GET /api/availability` to render events. (Ref: App Flow: Facility Owner).
28. **Implement search flow**: In `/pages/index.tsx`, capture search form, call `/api/listings/search`, and pass results to `SearchMap` component. (Ref: App Flow: Renter).
29. **Booking workflow**: In `/pages/listing/[id].tsx`, implement slot selection UI, show `InsuranceWidget`, then invoke `/api/payments/checkout` and redirect to Stripe Checkout. (Ref: App Flow: Booking Workflow).
30. **Handle webhooks**: Create `/pages/api/webhooks/stripe.ts` to process `checkout.session.completed` events, update `bookings.status`, and send confirmation email. (Ref: Project Summary: Booking Workflow).
    - **Validation**: Use Stripe CLI to send webhook and confirm DB update and email.
31. **Dashboard for Renter**: Create `/pages/dashboard/renter.tsx` to list bookings with status and links to COI. (Ref: Project Summary: Dashboards).
32. **Dashboard for Owner**: Create `/pages/dashboard/owner.tsx` to list incoming booking requests with approve/reject buttons calling `/api/bookings/{id}/status`. (Ref: Project Summary: Dashboards).
33. **Apply Supabase RLS policies**:
    1. For `listings`, `availability`, `bookings`, enforce row-level permission by owner and renter via `auth.uid()` in `supabase/migrations/002_rls.sql`. (Ref: Project Summary: User Authentication).
    2. Deploy via MCP server. (Ref: Phase 1 Step 7).

## Phase 5: Deployment

34. **Set environment variables**: In Vercel/AWS, configure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `STRIPE_SECRET_KEY`, `SENDGRID_API_KEY`, `COVERWALLET_KEY`. (Ref: Tech Stack)
35. **Deploy to Vercel**:
    1. Connect GitHub repo to Vercel and select Node.js 20 runtime in region `us-east-1`. (Ref: Tech Stack: Deployment).
    2. Add build command `pnpm build` and output directory `.next`. (Ref: Next.js documentation)
    - **Validation**: Visit production URL and confirm homepage.
36. **Enable Supabase production**: In Supabase Dashboard, apply same migrations and RLS policies. (Ref: Tech Stack: Backend)
37. **Set up Stripe Webhooks**: In Stripe Dashboard, register webhook endpoint `https://yourdomain.com/api/webhooks/stripe`. (Ref: Tech Stack: Payment)
38. **CI/CD with Github Actions**:
    1. Create `.github/workflows/ci.yml` that runs `pnpm test`, `pnpm lint`, and `pnpm build` on push to main. (Ref: Dev Tools)
    - **Validation**: Push code and confirm workflow passes.

## Phase 6: Post-Deployment & Monitoring

39. **Monitor errors**: Integrate Sentry by installing `@sentry/nextjs` and configuring DSN in `sentry.server.config.js`. (Ref: Dev Tools)
40. **Add booking retry logic**: In `/pages/api/bookings/[id]/status.ts`, wrap external calls (Stripe, CoverWallet) with retry (3 attempts, 2s delay). (Ref: Q&A: Payment Failures)
41. **Implement 404 fallback**: Create `/src/pages/404.tsx` with “Return Home” button styled in brand colors. (Ref: App Flow: Error States)
42. **Test geospatial queries**: Write integration test in `/tests/search.test.ts` using supabase-js to ensure `ST_DWithin` returns correct listings. (Ref: Tech Stack: Backend)
43. **E2E tests with Cypress**: Install Cypress, write tests in `/cypress/integration/booking.spec.js` for full renter demo. (Ref: MVPs)
44. **Performance audit**: Run Lighthouse on production URL, optimize images via Next.js `next/image` and code-splitting. (Ref: PRD: Performance)
45. **Document API**: Generate OpenAPI spec in `/docs/openapi.yaml` describing all `/api/*` endpoints. (Ref: RFP: API Documentation)
46. **Onboard Admin Panel**: Create `/pages/admin/users.tsx` with user table using Supabase Admin SDK. (Ref: Project Summary: Admin Panel)
47. **Add role management UI**: In admin panel, enable role change dropdown for each user and call `/api/admin/users/{id}/role`. (Ref: Project Summary: User Roles)
48. **Validation**: Run manual smoke test: owner creates listing, renter books, insurance widget loads, Stripe Checkout completes, email arrives.
49. **Finalize cursor metrics**: Populate `cursor_metrics.md` with coverage, test results, and performance metrics. (Ref: Dev Tools: Cursor)
50. **Review & handoff**: Generate README with setup, environment variables, and contribution guidelines in project root. (Ref: Dev Tools)

---

*All steps reference the Project Summary and Tech Stack as outlined at project kickoff.*