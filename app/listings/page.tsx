"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Listing {
  id: string;
  name: string;
  description: string;
  photos: string[];
  hourly_rate: number;
  daily_rate: number;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load listings");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {listings && listings.length > 0 ? (
        listings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-lg transition-shadow">
            {listing.photos && listing.photos.length > 0 ? (
              <Image
                src={listing.photos[0]}
                alt={listing.name}
                width={400}
                height={250}
                className="w-full h-48 object-cover rounded-t-xl"
                priority={false}
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-xl text-gray-400">
                No photo
              </div>
            )}
            <CardHeader>
              <CardTitle>{listing.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
              <div className="flex gap-4 text-sm font-semibold">
                <span className="text-primary">${listing.hourly_rate}/hr</span>
                <span className="text-muted-foreground">${listing.daily_rate}/day</span>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500">No listings found.</div>
      )}
    </div>
  );
} 