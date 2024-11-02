// src/GoogleMapComponent.tsx
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GoogleMapComponent: React.FC = () => {
  // État pour stocker la position actuelle de l'utilisateur
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Vérifie si la géolocalisation est disponible dans le navigateur
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Met à jour l'état avec les coordonnées de l'utilisateur
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation : ", error);
        }
      );
    } else {
      console.log("La géolocalisation n'est pas disponible dans ce navigateur.");
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={userLocation || { lat: 48.8566, lng: 2.3522 }} // Par défaut, centre sur Paris
        zoom={userLocation ? 14 : 10} // Zoom plus proche si la position de l'utilisateur est trouvée
      >
        {/* Marqueur pour la position de l'utilisateur */}
        {userLocation && <Marker position={userLocation} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;