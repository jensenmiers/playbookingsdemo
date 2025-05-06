# App Flow Document for Rental Marketplace Platform

## Onboarding and Sign-In/Sign-Up

When a new user arrives at the platform, they land on the public home page where they can explore sample listings or click the Sign Up button in the header. The sign-up page offers three methods to create an account: email and password, Google social login, or single sign-on via school or corporate identity providers, all powered by Supabase Auth. After choosing a method, the user enters their credentials and submits the form. Email sign-ups receive a verification link. Google or SSO users are redirected back automatically upon successful authentication. Existing users select Sign In and provide their credentials or choose the social login option again. If the user forgets their password, they can click the Forgot Password link, enter their email, and receive a reset link via SendGrid. When they click that link, they are directed to a page to set a new password. Users can sign out at any time by clicking the Log Out button in the navigation bar, which clears their session and returns them to the landing page.

## Main Dashboard or Home Page

After signing in, all users see a navigation header with links to Home, Dashboard, Messages, and Account Settings. Renters are taken to a Home search interface featuring a map and a list of available courts. Owners land on their Owner Dashboard, which shows incoming booking requests, upcoming reservations, and a quick link to create a new listing. Admins see a custom Admin Panel link that reveals user, listing, booking, and payout management sections. A sidebar provides quick access to each user’s relevant pages, and a top bar shows notifications and a profile menu. From here, users navigate by clicking on tiles or links in the sidebar or header to move to specific sections of the app.

## Detailed Feature Flows and Page Transitions

### Searching and Selecting Courts for Renters

On the renter home page, the user enters a location or allows the browser to share their current coordinates. They pick a date and time window in the header form. The map on the left and the list on the right update in real time using Google Maps API and Postgres spatial queries. Clicking on any court card or map marker takes the user to a court detail page. There, the renter sees photos, amenities, house rules, and a FullCalendar view of open slots. Selecting an available slot opens a modal that shows the price breakdown with hourly rate, taxes, and insurance options. 

### Booking, Insurance, and Payment

Within the price breakdown modal, the renter chooses to upload their own Certificate of Insurance or purchase coverage via the embedded CoverWallet widget. Once insurance is attached, the renter clicks Proceed to Pay, which launches a Stripe Checkout session. After entering card details and confirming payment, the booking moves into a Pending Approval state. A confirmation email is sent immediately via SendGrid. The renter is redirected to their Renter Dashboard.

### Renter Dashboard Management

On the Renter Dashboard, upcoming reservations appear in a list with status labels and insurance documents attached. The renter can cancel any booking that is more than 48 hours away for a full refund. Cancellations between 24 and 48 hours prompt a 50 percent refund notice. Clicking on a reservation expands details and shows a button to message the facility owner directly. Past bookings are archived in a history section for reference and receipts.

### Listing Creation and Availability for Facility Owners

Owners access a Create Listing wizard from their Owner Dashboard. Step one collects court name, address, and description. Step two lets them upload photos and define amenities. Step three sets house rules and hourly pricing. Step four displays a FullCalendar integration styled with shadcn/ui, where owners drag available 30-minute time slots. Finally, the owner is prompted to connect their Stripe account through Stripe Connect onboarding. After completion, the listing goes live and appears on the renter home page.

### Booking Approval and Payouts for Facility Owners

When a renter books a slot, the owner sees a new notification badge in the sidebar. Clicking that request opens a detail view that displays the renter’s insurance certificate and payment authorization. The owner can approve or decline. Approving triggers a payment capture in Stripe. Declining issues an automatic refund and sends an email notification to the renter. The owner can also block off dates directly from the calendar or send a message to the renter in the same view. Approved bookings populate their Upcoming Schedule. The Payouts tab shows pending and completed transfers from Stripe Connect, updated in real time via webhooks.

### Admin Panel and Platform Management

Admins click the Admin Panel link in the sidebar to reveal user management, listing moderation, booking oversight, and dispute resolution pages. Each page lists database records with search and filter controls. Admins can create, read, update, or delete any record. Role-based access is enforced by Supabase Row-Level Security so only admins see these panels. A logs section captures activity history for audits.

## Settings and Account Management

Users navigate to Account Settings from the profile menu in the header. Here, they update personal details such as name, email, and password. They can manage notification preferences, choosing between email or, in future releases, SMS alerts via Twilio. Facility owners have an additional section to manage their Stripe payout account or revise bank details. All changes are saved through API calls to Supabase. After saving changes, a confirmation message appears and the user can click Back to Dashboard in the header to return to their main view.

## Error States and Alternate Paths

If a user tries to sign in with invalid credentials, an inline error appears under the form field prompting them to retry or reset their password. During booking, if the payment fails, the Stripe error message is displayed in the modal and the user can correct their card details or try another method. If the CoverWallet widget fails to load, a fallback link appears to purchase insurance on a separate page. Network connectivity issues show a full-screen banner indicating offline status and hide interactive controls until the connection is restored. If a renter attempts to view or cancel a booking they do not own, a permission denied message is shown and they are redirected to their dashboard.

## Conclusion and Overall App Journey

From the moment a user arrives on the landing page to the day-to-day management of bookings or listings, the platform guides each role through a clear series of pages. Renters discover courts with a split map and list view, select time slots, manage insurance, and pay securely via Stripe. Facility owners walk through a step-by-step wizard to create listings, set availability on a calendar, approve reservations, and track payouts. Admins oversee the entire ecosystem in a dedicated panel protected by strict access controls. Every action connects seamlessly to the next, creating a cohesive rental marketplace experience for indoor basketball courts that is both functional and proud to showcase its retro-inspired design.