import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Placeholder for Google Maps loader (to be implemented in /src/lib/google-maps.ts)
// import { loadGoogleMaps } from "@/lib/google-maps";

// Mock listings
const mockListings = [
  {
    id: 1,
    name: "Retro Gatorade Gym",
    address: "123 Main St, City, State",
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: 2,
    name: "Skyline Hoops",
    address: "456 Market St, City, State",
    lat: 37.7849,
    lng: -122.4094,
  },
];

const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 };

const SearchMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(5); // miles
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined" || !mapRef.current) return;
    // @ts-ignore
    if (!window.google) {
      // TODO: Use loader from /src/lib/google-maps.ts
      return;
    }
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    // Add markers
    mockListings.forEach((listing) => {
      new window.google.maps.Marker({
        position: { lat: listing.lat, lng: listing.lng },
        map: mapInstance,
        title: listing.name,
      });
    });
    setMap(mapInstance);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto my-8">
      {/* Left: Map and controls */}
      <div className="flex-1 min-w-[300px]">
        <div className="flex items-center gap-4 mb-4">
          <Input
            type="number"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-24"
            placeholder="Radius (mi)"
          />
          <Button variant="outline">Apply Radius</Button>
          <Button variant="secondary">Bounding Box</Button>
        </div>
        <div
          ref={mapRef}
          className="w-full h-80 rounded-lg border shadow-sm"
          style={{ minHeight: 320 }}
        />
      </div>
      {/* Right: Listing results */}
      <div className="flex-1 min-w-[250px]">
        <h2 className="text-lg font-semibold mb-2">Results</h2>
        <div className="space-y-4">
          {mockListings.map((listing) => (
            <div key={listing.id} className="p-4 rounded-lg border bg-background shadow-sm">
              <div className="font-bold text-primary mb-1">{listing.name}</div>
              <div className="text-sm text-muted-foreground mb-1">{listing.address}</div>
              <div className="text-xs text-gray-500">Lat: {listing.lat}, Lng: {listing.lng}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchMap; 