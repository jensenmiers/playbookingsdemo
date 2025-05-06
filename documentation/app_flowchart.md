flowchart TD
  LandingPage[Landing Page] --> RoleSelection[Select Role]
  RoleSelection -->|Owner| OwnerLogin[Owner Login or Register]
  RoleSelection -->|Renter| RenterLogin[Renter Login or Register]
  OwnerLogin --> OwnerDashboard[Owner Dashboard]
  OwnerDashboard --> ListingWizard[Create Facility Listing]
  ListingWizard --> Availability[Set Availability]
  Availability --> StripeConnect[Connect Stripe Account]
  StripeConnect --> BookingMgmt[Manage Bookings]
  BookingMgmt --> ViewCOI[View Certificates]
  BookingMgmt --> EmailNotif[Send Email Notification]
  RenterLogin --> SearchPage[Search Facilities]
  SearchPage --> ListingDetail[View Facility Details]
  ListingDetail --> SlotSelect[Select Time Slot]
  SlotSelect --> InsuranceChoice{Upload COI or Purchase Insurance}
  InsuranceChoice -->|Upload COI| UploadCOI[Upload Certificate]
  InsuranceChoice -->|Purchase Insurance| PurchaseIns[Purchase via CoverWallet]
  UploadCOI --> Payment[Proceed to Payment]
  PurchaseIns --> Payment
  Payment --> Confirmation[Booking Confirmation]
  Confirmation --> RenterDashboard[Renter Dashboard]
  Confirmation --> EmailNotif
  RenterDashboard --> CancelChoice{Cancel Booking}
  CancelChoice -->|Yes| Refund[Process Refund]
  CancelChoice -->|No| EndFlow[End]