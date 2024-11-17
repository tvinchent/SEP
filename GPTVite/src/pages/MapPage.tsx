import '../App.css';
import React, { useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GoogleMapComponent from '../components/GoogleMapComponent';
import { fetchActivities } from '../controllers/apiServiceGPT';
import { Activity } from '../types';
import { v4 as uuidv4 } from 'uuid';
// import resaIcon from '../assets/book.webp';
import AddCircleIcon from '../assets/add_circle.svg';
// import telIcon from '../assets/tel.png';
import PlayCircleIcon from '../assets/play_circle.svg';
import LoadingOverlay from '../components/LoadingOverlay';
import logo from '../assets/logo-goyolo.png';

interface UserInfo {
  name: string;
  activityPreferences: string;
}

const MapPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Utilisez `as` pour indiquer à TypeScript le type de `location.state`
  const userInfo = location.state as UserInfo | undefined;

  // Si `userInfo` est `undefined`, rediriger vers la page d'accueil
  React.useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Commence avec `false` pour ne pas afficher le LoadingOverlay au départ
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Bouton désactivé jusqu'au chargement de la carte
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

  const handleGetSuggestions = useCallback(async () => {
    setIsLoading(true); // Affiche le LoadingOverlay
    setIsButtonDisabled(true); // Désactive le bouton pendant le chargement

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;

        if (bounds) {
          // Utiliser les infos utilisateur pour personnaliser l'appel à l'API
          const data = await fetchActivities(userLatitude, userLongitude, bounds, userInfo);
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
        setIsButtonDisabled(false); // Réactive le bouton après le chargement
      });
    } else {
      console.error("La géolocalisation n'est pas supportée par ce navigateur.");
      setIsLoading(false);
      setIsButtonDisabled(false); // Réactive le bouton même en cas d'erreur
    }
  }, [bounds, userInfo]);

  const handleMarkerClick = (activity: Activity) => {
    setSelectedActivity(activity);
    activityInfoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
    <div className="container">
      {isLoading && <LoadingOverlay />}
      <img src={logo} className="img-fluid" alt="Logo Goyolo" />
      {/* <h1>Suggestions d'activités adaptées</h1> */}

      <button 
        onClick={handleGetSuggestions} 
        className={`suggestButton ${isButtonDisabled ? 'disabled' : ''}`} 
        disabled={isButtonDisabled}
      >
        Cliquez ici pour obtenir des suggestions
      </button>

      <GoogleMapComponent 
        activities={activities}  
        onMarkerClick={handleMarkerClick} 
        onMapLoad={() => setIsButtonDisabled(false)}  // Active le bouton lorsque la carte est chargée
        onMapDragEnd={() => setIsButtonDisabled(false)}  
        onBoundsChange={handleBoundsChange}
      />

      {selectedActivity && (
        <div ref={activityInfoRef} className="activity-info">
          <h2>Détails de l'activité</h2>
          <p className='activityName'><strong> {selectedActivity.name} </strong></p>
          <p>{selectedActivity.description}</p>
          <p className='activityOpening'><strong>Horaires d'ouverture :</strong> {selectedActivity.opening_hours}</p>
          {selectedActivity.booking_link && (
            <span><a href={selectedActivity.booking_link} target="_blank" rel="noopener noreferrer" className='link'><img src={AddCircleIcon} alt="Reserver" /> Reserver</a></span>
          )}
          &nbsp;
          {selectedActivity.phone_number && (
            <span><a href={`tel:${selectedActivity.phone_number}`} className='link'><img src={PlayCircleIcon} alt="Appeler" /> Appeler</a></span>
          )}
        <h6>ChatGPT peut faire des erreurs. Envisagez de vérifier les informations importantes.</h6>
        </div>
      )}
      </div>
    </>
  );
};

export default MapPage;
