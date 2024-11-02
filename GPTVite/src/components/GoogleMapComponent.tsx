// src/GoogleMapComponent.tsx
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Activity {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface GoogleMapComponentProps {
  activities: Activity[];
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ activities }) => {
  // Coordonnées par défaut (ex : Paris)
  const center = { lat: 48.8566, lng: 2.3522 };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={{ width: '100%', height: '400px' }} center={center} zoom={10}>
        {/* Ajout des marqueurs pour chaque activité */}
        {activities.map((activity) => (
          <Marker
            key={activity.id}
            position={{ lat: activity.lat, lng: activity.lng }}
            label={activity.name} // Affiche le nom de l'activité sur le marqueur
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
