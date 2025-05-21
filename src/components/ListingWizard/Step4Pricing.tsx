import * as React from "react";
import { useState } from "react";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";

interface Step4PricingProps {
  initialValues?: {
    hourlyRate?: number;
    dailyRate?: number;
  };
  onNext: (values: { hourlyRate: number; dailyRate?: number }) => void;
  onBack?: () => void;
}

export function Step4Pricing({ initialValues, onNext, onBack }: Step4PricingProps) {
  const [hourlyRate, setHourlyRate] = useState(initialValues?.hourlyRate ?? "");
  const [dailyRate, setDailyRate] = useState(initialValues?.dailyRate ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hr = Number(hourlyRate);
    const dr = dailyRate === "" ? undefined : Number(dailyRate);
    if (isNaN(hr) || hr <= 0) {
      setError("Hourly rate must be a positive number.");
      return;
    }
    if (dr !== undefined && (isNaN(dr) || dr <= 0)) {
      setError("Daily rate must be a positive number if provided.");
      return;
    }
    setError(null);
    onNext({ hourlyRate: hr, dailyRate: dr });
  }

  return (
    <form className="space-y-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="hourlyRate">Hourly Rate ($/hr) *</Label>
        <Input
          id="hourlyRate"
          name="hourlyRate"
          type="number"
          min={1}
          step={1}
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          required
          placeholder="e.g. 50"
        />
      </div>
      <div>
        <Label htmlFor="dailyRate">Daily Rate ($/day, optional)</Label>
        <Input
          id="dailyRate"
          name="dailyRate"
          type="number"
          min={1}
          step={1}
          value={dailyRate}
          onChange={(e) => setDailyRate(e.target.value)}
          placeholder="e.g. 400"
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2 mt-6">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button type="submit" className="flex-1">
          Finish
        </Button>
      </div>
    </form>
  );
} 