import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MapPage from './pages/MapPage';

const App: React.FC = () => {
  return (
    <Router basename="/sep/GPTVite">
      <Routes>
        <Route path="/" element={<Home />} /> {/* Page d'accueil */}
        <Route path="/map" element={<MapPage />} /> {/* Page de la carte */}
      </Routes>
    </Router>
  );
};

export default App;
