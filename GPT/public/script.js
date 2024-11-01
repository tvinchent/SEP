// script.js

let map;
let userPosition;
let AdvancedMarkerElement; // Pour rendre disponible AdvancedMarkerElement globalement
let mapInitializedResolve;
let mapInitialized = new Promise((resolve, reject) => {
  mapInitializedResolve = resolve;
});

async function initMap() {
  // Importer les bibliothèques nécessaires
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  //@ts-ignore
  const { AdvancedMarkerElement: AdvMarker } = await google.maps.importLibrary(
    "marker"
  );

  AdvancedMarkerElement = AdvMarker; // Assignation pour une utilisation ultérieure

  // Fonction pour initialiser la carte avec une position donnée
  function initializeMap(position) {
    map = new Map(document.getElementById("map"), {
      center: position,
      zoom: 12,
      mapId: "YOUR_MAP_ID", // Remplacez par votre Map ID réel
    });
  }

  // Vérifier si le navigateur supporte la géolocalisation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // Succès : l'utilisateur a autorisé la géolocalisation
      (position) => {
        userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Initialiser la carte centrée sur la position de l'utilisateur
        initializeMap(userPosition);

        // Ajouter un marqueur pour la position de l'utilisateur
        const userMarker = new AdvancedMarkerElement({
          position: userPosition,
          map: map,
          title: "Votre position",
        });

        // La carte est prête
        mapInitializedResolve();
      },
      // Erreur : l'utilisateur a refusé la géolocalisation ou autre erreur
      (error) => {
        console.warn("Erreur de géolocalisation:", error.message);
        // Utiliser une position par défaut (Paris)
        userPosition = { lat: 48.8566, lng: 2.3522 };
        initializeMap(userPosition);

        // La carte est prête
        mapInitializedResolve();
      }
    );
  } else {
    // Le navigateur ne supporte pas la géolocalisation
    console.warn("La géolocalisation n'est pas supportée par ce navigateur.");
    // Utiliser une position par défaut (Paris)
    userPosition = { lat: 48.8566, lng: 2.3522 };
    initializeMap(userPosition);

    // La carte est prête
    mapInitializedResolve();
  }
}

// Appeler la fonction initMap
initMap();

// Attendre que la carte soit initialisée avant de traiter le formulaire
document
  .getElementById("capabilities-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    await mapInitialized; // Attendre que la carte soit prête

    // Récupérer les capacités sélectionnées
    const capabilities = {
      pmr: document.getElementById("pmr").checked,
      easily_fatigued: document.getElementById("easily_fatigued").checked,
      valid: document.getElementById("valid").checked,
      latitude: userPosition.lat,
      longitude: userPosition.lng,
    };

    try {
      const response = await fetch("../api/get_activities.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(capabilities),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // Afficher la carte
      document.getElementById("map").style.display = "block";

      // Effacer les anciens marqueurs
      if (window.markers) {
        window.markers.forEach((marker) => (marker.map = null));
      }
      window.markers = [];

      // Ajouter les nouveaux marqueurs
      data.activities.forEach((activity) => {
        const marker = new AdvancedMarkerElement({
          position: { lat: activity.latitude, lng: activity.longitude },
          map: map,
          title: activity.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<h3>${activity.name}</h3><p>${activity.description}</p>`,
        });

        marker.addListener("gmp-click", () => {
          infoWindow.open(map, marker);
        });

        window.markers.push(marker);
      });

      // Ajuster la vue de la carte pour inclure tous les marqueurs
      if (window.markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        window.markers.forEach((marker) => bounds.extend(marker.position));
        // Inclure la position de l'utilisateur dans les limites
        bounds.extend(userPosition);
        map.fitBounds(bounds);
      } else {
        console.warn("Aucun marqueur à afficher sur la carte.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la récupération des suggestions.");
    }
  });
