import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Activity } from '../types';

interface GoogleMapComponentProps {
  activities: Activity[];
  onMarkerClick: (activity: Activity) => void;
  onMapLoad: () => void;
  onMapDragEnd: () => void;
  onBoundsChange: (bounds: { north: number; south: number; east: number; west: number }) => void; // Nouvelle prop pour transmettre les limites de la carte
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ activities, onMarkerClick, onMapLoad, onMapDragEnd, onBoundsChange }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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

  const handleBoundsChanged = () => {
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        const north = bounds.getNorthEast().lat();
        const east = bounds.getNorthEast().lng();
        const south = bounds.getSouthWest().lat();
        const west = bounds.getSouthWest().lng();
        onBoundsChange({ north, south, east, west });
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        onLoad={(mapInstance) => {
          setMap(mapInstance);
          onMapLoad();
        }}
        onDragEnd={() => {
          onMapDragEnd();
          handleBoundsChanged(); // Met à jour les limites lorsque la carte est déplacée
        }}
        onZoomChanged={handleBoundsChanged} // Met à jour les limites lorsque le zoom change
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={userLocation || { lat: 48.8566, lng: 2.3522 }}
        zoom={userLocation ? 14 : 10}
      >
        {activities.map((activity) => (
          <Marker
            key={activity.id}
            position={{ lat: activity.lat, lng: activity.lng }}
            label={activity.name.charAt(0)}
            onClick={() => onMarkerClick(activity)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
