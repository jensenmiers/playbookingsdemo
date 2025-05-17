import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";

interface Step1DetailsProps {
  initialValues?: {
    name?: string;
    description?: string;
    address?: string;
    courtType?: string;
  };
  onNext: (values: {
    name: string;
    description: string;
    address: string;
    courtType: string;
  }) => void;
}

const COURT_TYPES = [
  "Full Court",
  "Half Court",
  "3x3 Court",
  "Other",
];

export function Step1Details({ initialValues, onNext }: Step1DetailsProps) {
  const [form, setForm] = useState({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    address: initialValues?.address || "",
    courtType: initialValues?.courtType || COURT_TYPES[0],
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCourtTypeChange(value: string) {
    setForm({ ...form, courtType: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.address || !form.courtType) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    onNext(form);
  }

  return (
    <form className="space-y-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Court Name *</Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Retro Gatorade Gym"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your court, features, etc."
        />
      </div>
      <div>
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          placeholder="123 Main St, City, State"
        />
      </div>
      <div>
        <Label htmlFor="courtType">Court Type *</Label>
        <Select
          value={form.courtType}
          onValueChange={handleCourtTypeChange}
        >
          <SelectTrigger id="courtType" name="courtType" />
          <SelectContent>
            {COURT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
      >
        Next
      </button>
    </form>
  );
} 