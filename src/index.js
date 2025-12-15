import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Add this line to import the Service Worker registration helper:
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; 
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// --- START OF REQUIRED CHANGE ---

// Call register() to start the Service Worker and enable PWA features.
// This registers the logic you wrote in src/service-worker.js
serviceWorkerRegistration.register(); 

// --- END OF REQUIRED CHANGE ---

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();