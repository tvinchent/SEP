// src/apiService.ts
import { Activity, ApiResponse } from '../types';

export const fetchActivities = async (latitude: number, longitude: number): Promise<Activity[] | null> => {
  try {
    const response = await fetch('http://localhost:3001/api/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données de l'API");
    }

    const data: ApiResponse = await response.json();

    // Mapper les propriétés si nécessaire
    return data.activities.map((activity) => ({
      ...activity,
      lat: activity.lat,  // Si les données API utilisent 'latitude' et 'longitude', ajuste ici
      lng: activity.lng,
    }));
  } catch (error) {
    console.error("Erreur API : ", error);
    return null;
  }
};
