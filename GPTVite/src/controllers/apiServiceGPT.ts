import { Activity, ApiResponse } from '../types';

interface UserInfo {
  name: string;
  activityPreferences: string;
}

export const fetchActivities = async (
  latitude: number,
  longitude: number,
  bounds?: { north: number; south: number; east: number; west: number },
  userInfo?: UserInfo // Ajout des informations utilisateur en tant que paramètre optionnel
): Promise<Activity[] | null> => {
  try {
    if (!bounds) {
      console.error("Les limites de la carte (bounds) ne sont pas définies.");
      return null;
    }

    const requestBody = {
      latitude,
      longitude,
      north: bounds.north,
      south: bounds.south,
      east: bounds.east,
      west: bounds.west,
      userInfo, // Ajout des informations utilisateur dans le corps de la requête
    };

    const response = await fetch('https://je-code.com/sep/GPTVite/api/getActivities.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
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
