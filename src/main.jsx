import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Service worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swUrl).then(registration => {
      // Check for updates on every page load
      registration.update();

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available; please refresh.
              console.log('New content available, reloading...');
              window.location.reload();
            }
          };
        }
      };
    }).catch(error => {
      console.error('Service worker registration failed:', error);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
