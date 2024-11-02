// src/types.ts
export interface Activity {
  id: number;
  name: string;
  description: string;
  lat: number; // Utilisation de 'lat' au lieu de 'latitude'
  lng: number; // Utilisation de 'lng' au lieu de 'longitude'
  opening_hours?: string;
  booking_link?: string;
  phone_number?: string;
}

export interface ApiResponse {
  activities: Activity[];
}