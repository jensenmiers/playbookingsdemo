import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface AvailabilitySlot {
  id: string;
  start: string;
  end: string;
}

interface AvailabilityCalendarProps {
  listingId: string;
  ownerView?: boolean; // If true, show CRUD controls (future)
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ listingId, ownerView = false }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/availability?listingId=${listingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.availability) {
          setEvents(
            data.availability.map((slot: AvailabilitySlot) => ({
              title: ownerView ? "Available (Owner)" : "Available",
              start: slot.start,
              end: slot.end,
              id: slot.id,
            }))
          );
        } else {
          setEvents([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load availability");
        setLoading(false);
      });
  }, [listingId, ownerView]);

  if (loading) {
    return <div className="p-4 text-center">Loading availability...</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto my-8">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height={500}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
      />
      {/* Future: Add CRUD controls if ownerView is true */}
    </div>
  );
};

export default AvailabilityCalendar; 