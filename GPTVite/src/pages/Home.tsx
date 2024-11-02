import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [ability, setAbility] = useState('PMR');
  const [activityPreferences, setActivityPreferences] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Redirection vers la page de la carte avec les infos utilisateur
    navigate('/map', { state: { ability, activityPreferences } });
  };

  return (
    <div className="container">
      <h1>Bienvenue !</h1>
      <p>Pour mieux personnaliser vos suggestions d'activités, merci de remplir ce formulaire.</p>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>
            Mes capacités :
            <select 
              value={ability} 
              onChange={(e) => setAbility(e.target.value)}
            >
                <option value="moteur">Handicap moteur</option>
                <option value="sensoriel">Handicap sensoriel</option>
                <option value="mental">Handicap mental</option>
                <option value="psychique">Handicap psychique</option>
                <option value="cognitif">Handicap cognitif</option>
                <option value="multi">Multi handicap</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Préférences d'activités : 
            <input 
              type="text" 
              value={activityPreferences} 
              onChange={(e) => setActivityPreferences(e.target.value)} 
              placeholder="Ex: sport, art, nature..." 
            />
          </label>
        </div>
        <button type="submit" className='helloButton'>Passer à la carte (acceptez la géolocalisation)</button>
      </form>
    </div>
  );
};

export default Home;
