// Utility to dynamically load the Google Maps JavaScript API

const GOOGLE_MAPS_API_URL = (apiKey: string) =>
  `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

export function loadGoogleMapsApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject('Not in browser');
    if ((window as any).google && (window as any).google.maps) {
      resolve();
      return;
    }
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      reject('Google Maps API key not found in NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
      return;
    }
    const script = document.createElement('script');
    script.src = GOOGLE_MAPS_API_URL(apiKey);
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
} 