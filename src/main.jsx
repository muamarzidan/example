import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import './index.css';


async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}

enableMocking()
  .catch((err) => {
    console.error('[MSW] Worker registration error:', err);
  })
  .finally(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
