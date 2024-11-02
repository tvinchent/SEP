// src/App.tsx
import './App.css'
import React, { useState } from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';
import { fetchActivities } from './controllers/apiService';
import { Activity } from './types';
import { v4 as uuidv4 } from 'uuid';
import telIcon from './assets/tel.png';
import resaIcon from './assets/book.webp';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null); // État pour le marqueur sélectionné
  const [isLoading, setIsLoading] = useState(true); // État de chargement de la carte
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // État du bouton

const handleGetSuggestions = async () => {
  setIsLoading(true);
  setIsButtonDisabled(false);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLatitude = position.coords.latitude;
      const userLongitude = position.coords.longitude;
      const data = await fetchActivities(userLatitude, userLongitude);
      if (data && data.length > 0) {
        const activitiesWithId = data.map((activity) => ({
            ...activity,
            id: uuidv4() // Génère un ID unique pour chaque activité
          }));
          setActivities(activitiesWithId);
          setSelectedActivity(activitiesWithId[0]); // Sélectionne automatiquement le premier élément
      }
      setIsLoading(false);
      setIsButtonDisabled(true); // Désactive le bouton après la fin de la requête
    }, 
    async (error) => {
      console.error("Erreur de géolocalisation:", error);
      // Utilisation des valeurs par défaut en cas d'erreur
      const userLatitude = 48.8566;
      const userLongitude = 2.3522;
      const data = await fetchActivities(userLatitude, userLongitude);
      if (data && data.length > 0) {
          const activitiesWithId = data.map((activity) => ({
            ...activity,
            id: uuidv4() // Génère un ID unique pour chaque activité
          }));
          setActivities(activitiesWithId);
          setSelectedActivity(activitiesWithId[0]); // Sélectionne automatiquement le premier élément
        }
        setIsLoading(false);
        setIsButtonDisabled(true); // Désactive le bouton après la fin de la requête
    });
  } else {
    console.error("La géolocalisation n'est pas supportée par ce navigateur.");
    setIsLoading(false); 
  }
};

// Fonction de rappel pour réactiver le bouton quand la carte est déplacée
  const handleMapDragEnd = () => {
    setIsButtonDisabled(false);
  };


  return (
    <>
      {isLoading && <LoadingOverlay />}
      <h1>Suggestions d'activités adaptées</h1>

      <GoogleMapComponent activities={activities}  onMarkerClick={setSelectedActivity} onMapLoad={() => setIsLoading(false)} onMapDragEnd={handleMapDragEnd} />
      <button 
        onClick={handleGetSuggestions} 
        className={`suggestButton ${isButtonDisabled ? 'disabled' : ''}`} 
        disabled={isButtonDisabled} // Désactive le bouton
      >Obtenir des suggestions</button>

      {/* Affichage des informations du marqueur sélectionné */}
      {selectedActivity && (
        <div className="activity-info">
          <h2>Détails de l'activité</h2>
          <p><strong> {selectedActivity.name} </strong></p>
          <p>{selectedActivity.description}</p>
          <p><strong>Horaires d'ouverture :</strong> {selectedActivity.opening_hours}</p>
          {/* Lien "Réserver" */}
          {selectedActivity.booking_link && (
            <span><a href={selectedActivity.booking_link} target="_blank" rel="noopener noreferrer"><img src={resaIcon} alt='Reserver' style={{ width: '20px', height: '20px' }} /></a></span>
          )}
          &nbsp;
          {/* Lien "Appeler" */}
          {selectedActivity.phone_number && (
            <span><a href={`tel:${selectedActivity.phone_number}`}><img src={telIcon} alt='Appeler' style={{ width: '20px', height: '20px' }} /></a></span>
          )}
        </div>
      )}

    </>
  );
};

export default App;
