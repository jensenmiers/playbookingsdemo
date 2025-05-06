import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WizardLayout } from "@/components/ListingWizard/WizardLayout";

describe("ListingWizard", () => {
  it("should complete the wizard and call onComplete with correct data", async () => {
    jest.useFakeTimers();
    const onComplete = jest.fn();
    render(<WizardLayout onComplete={onComplete} />);

    // Step 1: Court details
    fireEvent.change(screen.getByLabelText(/Court Name/i), { target: { value: "Test Gym" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "A great court" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Main St" } });
    fireEvent.change(screen.getByLabelText(/Court Type/i), { target: { value: "Full Court" } });
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Step 2: Photos (simulate upload)
    const file = new File(["dummy content"], "photo.png", { type: "image/png" });
    const fileInput = screen.getByLabelText(/Upload Court Photos/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for the Next button to become enabled (upload complete)
    const nextButton = await screen.findByRole("button", { name: /Next/i });
    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);

    // Advance timers to resolve simulated upload
    jest.runAllTimers();

    // Wait for Step 3 to render
    await waitFor(() => expect(screen.getByLabelText(/Scoreboard/i)).toBeInTheDocument());

    // Step 3: Amenities and rules
    fireEvent.click(screen.getByLabelText(/Scoreboard/i));
    fireEvent.click(screen.getByLabelText(/No Food or Drink/i));
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Step 4: Pricing
    fireEvent.change(screen.getByLabelText(/Hourly Rate/i), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText(/Daily Rate/i), { target: { value: "400" } });
    fireEvent.click(screen.getByRole("button", { name: /Finish/i }));

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Gym",
          description: "A great court",
          address: "123 Main St",
          courtType: "Full Court",
          hourlyRate: 50,
          dailyRate: 400,
          // photos, amenities, rules are also present
        })
      );
    });

    // Restore real timers at the end
    jest.useRealTimers();
  });
}); 