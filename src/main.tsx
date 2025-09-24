import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WineDataProvider } from './context/WineDataContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WineDataProvider>
      <App />
    </WineDataProvider>
  </React.StrictMode>
);
