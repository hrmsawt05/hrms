// client/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './index.css'; // ⭐ Make sure this import is present!

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
//