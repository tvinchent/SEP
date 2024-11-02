import React from 'react';
import loadingImage from '../assets/loading.gif';

const LoadingOverlay: React.FC = () => (
  <div className="loading-overlay">
    <img src={loadingImage} alt="Chargement..." />
  </div>
);

export default LoadingOverlay;
