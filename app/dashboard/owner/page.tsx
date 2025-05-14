"use client";

import { useState, useEffect } from "react";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Listing {
  id: string;
  name: string;
}

// TODO: Replace with real user ID from auth context/session
const MOCK_USER_ID = "mock-owner-id";

export default function OwnerDashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/listings?owner_id=${MOCK_USER_ID}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load listings");
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Owner Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Select a listing:</label>
            {loading ? (
              <div>Loading listings...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <select
                className="border rounded px-3 py-2 w-full"
                value={selectedListing || ""}
                onChange={(e) => setSelectedListing(e.target.value)}
              >
                <option value="" disabled>
                  -- Choose a listing --
                </option>
                {listings.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </CardContent>
      </Card>
      {selectedListing && (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Availability</h2>
          <AvailabilityCalendar listingId={selectedListing} ownerView={true} />
        </div>
      )}
    </div>
  );
} 