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

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);
  if (!listing) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        {listing.photos && listing.photos.length > 0 && (
          <Image
            src={listing.photos[0]}
            alt={listing.name}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-t-xl"
            priority={true}
          />
        )}
        <CardHeader>
          <CardTitle>{listing.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-700">{listing.description}</p>
          <div className="flex gap-4 mb-4">
            <span className="text-primary font-semibold">${listing.hourly_rate}/hr</span>
            <span className="text-muted-foreground">${listing.daily_rate}/day</span>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Availability</h2>
        <AvailabilityCalendar listingId={listing.id} />
      </div>
    </div>
  );
} 