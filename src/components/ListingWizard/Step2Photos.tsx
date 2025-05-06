import * as React from "react";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Step2PhotosProps {
  initialPhotos?: string[];
  onNext: (photoUrls: string[]) => void;
  onBack?: () => void;
}

export function Step2Photos({ initialPhotos = [], onNext, onBack }: Step2PhotosProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files);
    setPhotos(fileArr);
    setPreviews(fileArr.map((file) => URL.createObjectURL(file)));
  }

  async function handleUpload() {
    setUploading(true);
    setError(null);
    try {
      // TODO: Replace with actual Supabase Storage upload logic
      // For now, just simulate upload and return preview URLs
      await new Promise((res) => setTimeout(res, 1000));
      // In production, replace previews with Supabase public URLs
      onNext(previews);
    } catch (err) {
      setError("Failed to upload photos. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <Label htmlFor="photos">Upload Court Photos (up to 5)</Label>
      <input
        id="photos"
        name="photos"
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mb-4"
      >
        Select Photos
      </Button>
      <div className="flex flex-wrap gap-4">
        {previews.map((src, idx) => (
          <div key={idx} className="relative w-32 h-32 border rounded overflow-hidden">
            <Image src={src} alt={`Photo ${idx + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2 mt-6">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} disabled={uploading}>
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={handleUpload}
          disabled={uploading || previews.length === 0}
          className="flex-1"
        >
          {uploading ? "Uploading..." : "Next"}
        </Button>
      </div>
    </div>
  );
} 