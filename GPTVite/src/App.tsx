// src/App.tsx
import './App.css'
import React, { useState } from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';
import { fetchActivities } from './controllers/apiService';
import { Activity } from './types';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

const handleGetSuggestions = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLatitude = position.coords.latitude;
      const userLongitude = position.coords.longitude;
      const data = await fetchActivities(userLatitude, userLongitude);
      if (data) setActivities(data);
    }, 
    async (error) => {
      console.error("Erreur de géolocalisation:", error);
      // Utilisation des valeurs par défaut en cas d'erreur
      const userLatitude = 48.8566;
      const userLongitude = 2.3522;
      const data = await fetchActivities(userLatitude, userLongitude);
      if (data) setActivities(data);
    });
  } else {
    console.error("La géolocalisation n'est pas supportée par ce navigateur.");
  }
};


  return (
    <>
      <h1>Ma Carte avec Activités</h1>
      <GoogleMapComponent activities={activities} />
      <button onClick={handleGetSuggestions} className='suggestButton'>Obtenir des suggestions</button>
    </>
  );
};

export default App;
