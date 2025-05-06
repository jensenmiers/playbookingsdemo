# Frontend Guideline Document

This document lays out how our indoor basketball court rental marketplace’s frontend is built, styled, and maintained. It’s written in clear, everyday language so anyone—technical or not—can understand the choices we made.

## Frontend Architecture

### 1. Core Frameworks and Libraries
- **React with Next.js 14**: We use React’s component model plus Next.js for server-side rendering (SSR), route-based code splitting, and built-in API routes (Node.js serverless functions).
- **Tailwind CSS** + **shadcn/ui**: Utility-first styling plus a library of accessible React components to speed up UI development.
- **FullCalendar**: A drop-in calendar component for owners to set and drag-and-drop availability slots.
- **Google Maps JavaScript API**: For location-based search, map rendering, and interactive pin placement.

### 2. Folder Structure
```
/app             # Next.js App Router (pages or app folder)
  /layout        # Shared layouts (header, footer, sidebar)
  /page          # Top-level pages (/, /listings, /dashboard...)
/components      # Reusable UI components (Button, Card, Modal...)
/ui              # shadcn/ui overrides and custom primitives
/styles          # Tailwind config, global styles, theme tokens
/hooks           # Custom React hooks (useAuth, useCalendar...)
/lib             # API clients, helper functions, geospatial logic
/tests           # Unit, integration, and E2E tests
```

### 3. Why This Architecture Works
- **Scalability**: Clear separation (pages vs. components) lets us add new features without code bloat.
- **Maintainability**: Small, focused files; meaningful naming; central theme tokens in one place.
- **Performance**: SSR/ISR from Next.js, dynamic imports, and Tailwind’s purge reduce bundle sizes and speed up load times.

## Design Principles

### 1. Usability
- Simple, step-by-step flows (e.g., listing wizard for gym owners).
- Clear calls to action (buttons, links) with consistent placement.

### 2. Accessibility
- shadcn/ui components are WAI-ARIA compliant out of the box.
- Color contrast meets WCAG AA standards.
- Keyboard navigation support everywhere (focus rings, skip links).

### 3. Responsiveness
- Mobile-first CSS breakpoints in Tailwind.
- Flexible grid layouts for cards and maps.
- Touch-friendly controls on calendars and forms.

## Styling and Theming

### 1. Approach
- **Utility-First (Tailwind CSS)**: Compose classes like `bg-electric-orange` or `text-deep-blue` directly in JSX.
- **Component Primitives (shadcn/ui)**: Wrap or extend base components (e.g., `<Button>`) with our theme tokens.

### 2. Visual Style
- **Overall Style**: Modern flat design with a retro twist inspired by classic Gatorade branding.
  - Flat buttons, clean edges, subtle shadows on cards.
  - Occasional glassmorphism effect on modals (semi-transparent backdrop with blur).

### 3. Color Palette (Retro Gatorade)
- Electric Orange: `#FF5C00` (primary action)
- Chartreuse Green: `#7FFF00` (secondary highlights)
- Deep Blue: `#003366` (navigation bars, footers)
- White & Light Gray: `#FFFFFF`, `#F5F5F5` (backgrounds)
- Dark Gray: `#333333` (text)

### 4. Typography
- **Headings**: Impact (for strong, attention-grabbing titles)
- **Body**: System sans-serif stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
- **Sizing**: Use Tailwind’s `text-sm` to `text-2xl` scales consistently.

## Component Structure

### 1. Organization
- **Atoms**: Buttons, Inputs, Labels in `/components/atoms`
- **Molecules**: Form groups, Calendar slot cards in `/components/molecules`
- **Organisms**: Full listing card, Map + Search bar combo in `/components/organisms`
- **Templates/Pages**: Layouts and full pages under `/app`

### 2. Reusability
- Each component gets its own folder (`index.tsx`, `styles.css`, `types.ts`).
- Props are clearly typed (TypeScript) and documented.
- Storybook can be added later for visual testing of each component in isolation.

### 3. Benefits of Component-Based Architecture
- Faster onboarding for new developers.
- Isolated bugs—fix one component without side effects.
- Easy to memoize or lazy-load heavy components (maps, calendars).

## State Management

### 1. Data Fetching
- **Next.js Data Fetching**: `getServerSideProps`/`getStaticProps` or the new `app` router `fetch` calls with caching.
- **Client-Side Caching**: We use [`SWR`](https://swr.vercel.app/) for client components to cache bookings, availability, and user info.

### 2. Global State
- **React Context** for authentication state (user session, roles).
- Context wrapping at the root (`/app/layout.tsx`).

### 3. Local State
- `useState` and custom hooks (`useCalendar`, `useMapSearch`) inside components for ephemeral UI state.

## Routing and Navigation

### 1. Next.js App Router
- File-based routing in `/app` or `/pages`.
- Dynamic routes for listings (`/listings/[id]`), dashboards, admin.

### 2. Navigation Flow
- **Public**: Home → Search → Listing Detail → Book → Login/Signup → Checkout
- **Renter Dashboard**: Dashboard → My Bookings → Manage (cancel or reschedule)
- **Owner Dashboard**: Dashboard → My Listings → Edit Listing → Availability Calendar → Booking Requests
- **Admin Panel**: `/admin` protected via middleware, uses React-Admin for CRUD.

### 3. Route Protection
- Next.js Middleware checks Supabase JWT for `/dashboard` and `/admin` paths.
- Redirects to login if unauthenticated or unauthorized.

## Performance Optimization

### 1. Code Splitting & Lazy Loading
- Use `next/dynamic` to lazy-load heavy components (FullCalendar, Google Maps).
- Only include Stripe and CoverWallet scripts on pages that need them.

### 2. Asset Optimization
- **Images**: `next/image` for automatic resizing and WebP conversion.
- **Fonts**: Self-hosted Impact or served via CDN with preload hints.

### 3. Caching & Data Layer
- ISR (Incremental Static Regeneration) for listing pages to offload repeated builds.
- SWR’s built-in revalidation to avoid redundant API calls.

### 4. Third-Party Quota Management
- Cache Google Maps responses (places autocomplete) in memory or localStorage.
- Monitor usage with a dashboard and fallback gracefully if quota is reached.

## Testing and Quality Assurance

### 1. Unit and Integration Tests
- **Jest** + **React Testing Library** for components and hooks.
- Test folder structure mirrors `/components`, `/hooks`, `/lib`.

### 2. End-to-End (E2E) Tests
- **Cypress** for full booking flow: search → select slot → upload COI → checkout.
- Mock third-party integrations (Stripe, CoverWallet) with stubs.

### 3. Linting and Formatting
- **ESLint** with Next.js and React rules.
- **Prettier** for consistent code style.
- GitHub Actions: run lint, tests, and type checks on each PR.

## Conclusion and Overall Frontend Summary

Our frontend is built on Next.js 14 and React, styled with Tailwind CSS and shadcn/ui, and organized in a clear, component-based folder structure. We’ve prioritized:
- **Scalability** through SSR/ISR and modular components.
- **Maintainability** with typed props, custom hooks, and theme tokens.
- **Performance** via code splitting, asset optimization, and caching.
- **Usability & Accessibility** with responsive layouts, WCAG compliance, and keyboard support.

This setup ensures a solid foundation for our MVP: quick listing creation for owners, intuitive booking flows for renters, and smooth integrations (Stripe, CoverWallet, Supabase). As we grow beyond MVP, this guideline will help us onboard new features—like SMS alerts via Twilio—without losing speed or quality.

Let’s build an amazing experience for gym owners and basketball fans alike!