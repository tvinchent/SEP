import './App.css'
import React, { useState, useRef } from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';
import { fetchActivities } from './controllers/apiService';
import { Activity } from './types';
import { v4 as uuidv4 } from 'uuid';
import telIcon from './assets/tel.png';
import resaIcon from './assets/book.webp';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [bounds, setBounds] = useState<{ north: number; south: number; east: number; west: number }>({
    north: 48.9021449,
    south: 48.815573,
    east: 2.4699208,
    west: 2.224199
  });

  const activityInfoRef = useRef<HTMLDivElement | null>(null);

  const handleBoundsChange = (newBounds: { north: number; south: number; east: number; west: number }) => {
    setBounds(newBounds);
  };

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setIsButtonDisabled(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;

        if (bounds) {
          const data = await fetchActivities(userLatitude, userLongitude, bounds);
          if (data && data.length > 0) {
            const activitiesWithId = data.map((activity) => ({
              ...activity,
              id: uuidv4(),
            }));
            setActivities(activitiesWithId);
            setSelectedActivity(activitiesWithId[0]);
          }
        }
        setIsLoading(false);
        setIsButtonDisabled(true);
      }, async (error) => {
        console.error("Erreur de géolocalisation:", error);
        const userLatitude = 48.8566;
        const userLongitude = 2.3522;

        if (bounds) {
          const data = await fetchActivities(userLatitude, userLongitude, bounds);
          if (data && data.length > 0) {
            const activitiesWithId = data.map((activity) => ({
              ...activity,
              id: uuidv4(),
            }));
            setActivities(activitiesWithId);
            setSelectedActivity(activitiesWithId[0]);
          }
        }
        setIsLoading(false);
        setIsButtonDisabled(true);
      });
    } else {
      console.error("La géolocalisation n'est pas supportée par ce navigateur.");
      setIsLoading(false);
    }
  };

  const handleMarkerClick = (activity: Activity) => {
    setSelectedActivity(activity);
    activityInfoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMapDragEnd = () => {
    setIsButtonDisabled(false);
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <h1>Suggestions d'activités adaptées</h1>
      
      <button 
        onClick={handleGetSuggestions} 
        className={`suggestButton ${isButtonDisabled ? 'disabled' : ''}`} 
        disabled={isButtonDisabled}
      >
        Obtenir des suggestions
      </button>

      <GoogleMapComponent 
        activities={activities}  
        onMarkerClick={handleMarkerClick} 
        onMapLoad={() => setIsLoading(false)} 
        onMapDragEnd={handleMapDragEnd}  
        onBoundsChange={handleBoundsChange} // Ajout de la fonction pour les limites
      />

      {selectedActivity && (
        <div ref={activityInfoRef} className="activity-info">
          <h2>Détails de l'activité</h2>
          <p><strong> {selectedActivity.name} </strong></p>
          <p>{selectedActivity.description}</p>
          <p><strong>Horaires d'ouverture :</strong> {selectedActivity.opening_hours}</p>
          {selectedActivity.booking_link && (
            <span><a href={selectedActivity.booking_link} target="_blank" rel="noopener noreferrer"><img src={resaIcon} alt='Reserver' style={{ width: '20px', height: '20px' }} /></a></span>
          )}
          &nbsp;
          {selectedActivity.phone_number && (
            <span><a href={`tel:${selectedActivity.phone_number}`}><img src={telIcon} alt='Appeler' style={{ width: '20px', height: '20px' }} /></a></span>
          )}
        </div>
      )}
    </>
  );
};

export default App;
