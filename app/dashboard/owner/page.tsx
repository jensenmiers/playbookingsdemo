"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "src/components/ui/card";

interface Listing {
  id: string;
  name: string;
}

// TODO: Replace with real user ID from auth context/session
const MOCK_USER_ID = "mock-owner-id";

export default function OwnerDashboardPage() {
  const [listings, setListings] = useState<Listing[]>([]);
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
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">Owner Dashboard</h1>
      <p className="mb-6 text-muted-foreground">Overview and quick actions for facility owners.</p>
      {/* Quick Actions Placeholder */}
      <div className="mb-8">
        <button className="bg-primary text-white px-4 py-2 rounded">+ Create New Listing</button>
      </div>
      {loading && <div>Loading your listings...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && listings.length === 0 && (
        <div className="text-muted-foreground">No listings found. Start by creating your first facility!</div>
      )}
      <div className="grid gap-4">
        {listings.map((listing) => (
          <Card key={listing.id}>
            <CardHeader>
              <CardTitle>{listing.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div>Listing ID: {listing.id}</div>
              {/* Add more listing details here as needed */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 