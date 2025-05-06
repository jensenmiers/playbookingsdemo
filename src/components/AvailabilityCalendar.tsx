import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

// Mock events for demonstration
const mockEvents = [
  { title: "Booked", start: "2024-07-10", end: "2024-07-11" },
  { title: "Available", start: "2024-07-12", end: "2024-07-13" },
];

interface AvailabilityCalendarProps {
  ownerView?: boolean; // If true, show CRUD controls (future)
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ ownerView = false }) => {
  return (
    <div className="max-w-2xl mx-auto my-8">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={mockEvents}
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