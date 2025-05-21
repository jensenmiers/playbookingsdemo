import * as React from "react";
import { useState } from "react";
import { Label } from "src/components/ui/label";
import { Checkbox } from "src/components/ui/checkbox";
import { Switch } from "src/components/ui/switch";
import { Button } from "src/components/ui/button";

interface Step3AmenitiesProps {
  initialAmenities?: string[];
  initialRules?: Record<string, boolean>;
  onNext: (values: { amenities: string[]; rules: Record<string, boolean> }) => void;
  onBack?: () => void;
}

const AMENITIES = [
  "Scoreboard",
  "Locker Rooms",
  "Parking",
  "Showers",
  "Seating",
  "WiFi",
  "Water Fountain",
  "Restrooms",
];

const RULES = [
  { key: "noFood", label: "No Food or Drink" },
  { key: "noPets", label: "No Pets Allowed" },
  { key: "noSmoking", label: "No Smoking" },
  { key: "indoorShoes", label: "Indoor Shoes Required" },
];

export function Step3Amenities({ initialAmenities = [], initialRules = {}, onNext, onBack }: Step3AmenitiesProps) {
  const [amenities, setAmenities] = useState<string[]>(initialAmenities);
  const [rules, setRules] = useState<Record<string, boolean>>({
    noFood: initialRules.noFood ?? false,
    noPets: initialRules.noPets ?? false,
    noSmoking: initialRules.noSmoking ?? false,
    indoorShoes: initialRules.indoorShoes ?? false,
  });

  function handleAmenityChange(amenity: string, checked: boolean) {
    setAmenities((prev) =>
      checked ? [...prev, amenity] : prev.filter((a) => a !== amenity)
    );
  }

  function handleRuleChange(key: string, value: boolean) {
    setRules((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext({ amenities, rules });
  }

  return (
    <form className="space-y-8 max-w-lg mx-auto" onSubmit={handleSubmit}>
      <div>
        <Label className="mb-2 block">Amenities</Label>
        <div className="grid grid-cols-2 gap-3">
          {AMENITIES.map((amenity, idx) => {
            const checkboxId = `amenity-${idx}`;
            return (
              <div key={amenity} className="flex items-center gap-2">
                <Checkbox
                  id={checkboxId}
                  checked={amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, !!checked)}
                />
                <Label htmlFor={checkboxId}>{amenity}</Label>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <Label className="mb-2 block">House Rules</Label>
        <div className="space-y-3">
          {RULES.map((rule) => (
            <div key={rule.key} className="flex items-center gap-3">
              <Switch
                checked={rules[rule.key]}
                onCheckedChange={(checked) => handleRuleChange(rule.key, !!checked)}
                id={rule.key}
              />
              <Label htmlFor={rule.key}>{rule.label}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button type="submit" className="flex-1">
          Next
        </Button>
      </div>
    </form>
  );
} 