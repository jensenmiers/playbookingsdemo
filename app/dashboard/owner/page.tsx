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
  return (
    <div>
      <h1>Owner Dashboard</h1>
      <p>Overview and quick actions for facility owners.</p>
    </div>
  );
} 