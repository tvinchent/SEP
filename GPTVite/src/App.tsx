// src/App.tsx
import './App.css'
import React, { useEffect, useState } from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';
import { fetchActivities } from './controllers/apiService';

interface Activity {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Récupérer les données de l'API
    const getActivities = async () => {
      const data = await fetchActivities();
      if (data) setActivities(data);
    };

    getActivities();
  }, []);

  return (
    <>
      <h1>Ma Carte avec Activités</h1>
      <GoogleMapComponent activities={activities} />
    </>
  );
};

export default App;
