// script.js

let map;
window.markers = []; // Pour stocker les marqueurs

// Assigner initMap à l'objet global window
window.initMap = function () {
  // Initialisation de la carte
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 48.8566, lng: 2.3522 }, // Paris par défaut
    zoom: 12,
  });
};

document
  .getElementById("capabilities-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupérer les capacités sélectionnées
    const capabilities = {
      pmr: document.getElementById("pmr").checked,
      easily_fatigued: document.getElementById("easily_fatigued").checked,
      valid: document.getElementById("valid").checked,
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
      window.markers.forEach((marker) => marker.setMap(null));
      window.markers = [];

      // Ajouter les nouveaux marqueurs
      data.activities.forEach((activity) => {
        const marker = new google.maps.Marker({
          position: { lat: activity.latitude, lng: activity.longitude },
          map: map,
          title: activity.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<h3>${activity.name}</h3><p>${activity.description}</p>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        window.markers.push(marker);
      });

      // Ajuster la vue de la carte pour inclure tous les marqueurs
      const bounds = new google.maps.LatLngBounds();
      window.markers.forEach((marker) => bounds.extend(marker.getPosition()));
      map.fitBounds(bounds);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la récupération des suggestions.");
    }
  });
