import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

/**
 * @file The main entry point for the React application.
 * This file handles rendering the root React component (`App`) into the DOM.
 */

// Find the root DOM element to mount the application.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element with ID "root". The application cannot be mounted.');
}

// Create a React root and render the application.
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);