// api/server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Exemple de route
app.get("/api/activities", (req, res) => {
  const activities = [
    { id: 1, name: "Activité 1", lat: 48.8566, lng: 2.3522 },
    { id: 2, name: "Activité 2", lat: 48.8566, lng: 2.3622 },
  ];
  res.json(activities);
});

app.listen(PORT, () => {
  console.log(`Serveur API démarré sur http://localhost:${PORT}`);
});
