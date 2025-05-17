import * as React from "react";
import { useState } from "react";
import { Step1Details } from "./Step1Details";
import { Step2Photos } from "./Step2Photos";
import { Step3Amenities } from "./Step3Amenities";
import { Step4Pricing } from "./Step4Pricing";

interface ListingWizardData {
  name: string;
  description: string;
  address: string;
  courtType: string;
  photos: string[];
  amenities: string[];
  rules: Record<string, boolean>;
  hourlyRate: number;
  dailyRate?: number;
}

interface WizardLayoutProps {
  onComplete: (data: ListingWizardData) => void;
}

export function WizardLayout({ onComplete }: WizardLayoutProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<ListingWizardData>>({});

  function handleNextStep1(values: any) {
    setForm((prev) => ({ ...prev, ...values }));
    setStep(1);
  }
  function handleNextStep2(photoUrls: string[]) {
    setForm((prev) => ({ ...prev, photos: photoUrls }));
    setStep(2);
  }
  function handleNextStep3(values: { amenities: string[]; rules: Record<string, boolean> }) {
    setForm((prev) => ({ ...prev, ...values }));
    setStep(3);
  }
  function handleNextStep4(values: { hourlyRate: number; dailyRate?: number }) {
    setForm((prev) => ({ ...prev, ...values }));
    // All steps complete, call onComplete
    onComplete({
      name: form.name!,
      description: form.description || "",
      address: form.address!,
      courtType: form.courtType!,
      photos: form.photos || [],
      amenities: form.amenities || [],
      rules: form.rules || {},
      hourlyRate: values.hourlyRate,
      dailyRate: values.dailyRate,
    });
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="py-8">
      {step === 0 && (
        <Step1Details
          initialValues={form}
          onNext={handleNextStep1}
        />
      )}
      {step === 1 && (
        <Step2Photos
          initialPhotos={form.photos}
          onNext={handleNextStep2}
          onBack={handleBack}
        />
      )}
      {step === 2 && (
        <Step3Amenities
          initialAmenities={form.amenities}
          initialRules={form.rules}
          onNext={handleNextStep3}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <Step4Pricing
          initialValues={{ hourlyRate: form.hourlyRate, dailyRate: form.dailyRate }}
          onNext={handleNextStep4}
          onBack={handleBack}
        />
      )}
      <div className="mt-8 text-center text-muted-foreground">Step {step + 1} of 4</div>
    </div>
  );
} 