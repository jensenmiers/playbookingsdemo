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
  ownerView?: boolean; // If true, show CRUD controls
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ listingId, ownerView = false }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvents = () => {
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
              allDay: true,
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
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId, ownerView]);

  // CREATE: Add slot on date click
  const handleDateClick = async (arg: any) => {
    if (!ownerView) return;
    const start = arg.dateStr;
    const end = arg.dateStr; // For now, single-day slot
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, start, end }),
      });
      if (!res.ok) throw new Error("Failed to create slot");
      fetchEvents();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE: Remove slot on event click
  const handleEventClick = async (arg: any) => {
    if (!ownerView) return;
    if (!window.confirm("Delete this availability slot?")) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/availability/${arg.event.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete slot");
      fetchEvents();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  // UPDATE: Drag to change slot (future, if multi-day supported)
  // const handleEventDrop = async (arg: any) => { ... }

  if (loading) {
    return <div className="p-4 text-center">Loading availability...</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto my-8">
      {actionLoading && <div className="mb-2 text-center text-sm text-gray-500">Saving...</div>}
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
        dateClick={ownerView ? handleDateClick : undefined}
        eventClick={ownerView ? handleEventClick : undefined}
        // eventDrop={ownerView ? handleEventDrop : undefined}
        editable={ownerView}
      />
    </div>
  );
};

export default AvailabilityCalendar; 