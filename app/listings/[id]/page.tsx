import { notFound } from "next/navigation";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Listing {
  id: string;
  name: string;
  description: string;
  photos: string[];
  hourly_rate: number;
  daily_rate: number;
}

async function getListing(id: string): Promise<Listing | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/listings/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.listing || null;
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Listing Detail Page</h1>
      <p>Details for listing ID: {params.id} will be shown here.</p>
    </div>
  );
} 