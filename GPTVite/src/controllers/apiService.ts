import { Activity, ApiResponse } from '../types';

export const fetchActivities = async (
  latitude: number,
  longitude: number,
  bounds?: { north: number; south: number; east: number; west: number } // bounds est optionnel
): Promise<Activity[] | null> => {
  try {
    if (!bounds) {
      console.error("Les limites de la carte (bounds) ne sont pas définies.");
      return null;
    }

    const response = await fetch('http://localhost:3002/api/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        latitude, 
        longitude,
        north: bounds.north, 
        south: bounds.south, 
        east: bounds.east, 
        west: bounds.west
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données de l'API");
    }

    const data: ApiResponse = await response.json();

    return data.activities.map((activity) => ({
      ...activity,
      lat: activity.lat,
      lng: activity.lng,
    }));
  } catch (error) {
    console.error("Erreur API : ", error);
    return null;
  }
};
