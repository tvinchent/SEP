// src/apiService.ts
export const fetchActivities = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/activities`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données de l'API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur API : ", error);
    return null;
  }
};
