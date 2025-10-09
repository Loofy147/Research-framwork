import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { logger } from './utils/logger';
import { registerServiceWorker } from './utils/serviceWorker';
import { performanceMonitor } from './utils/performance';

/**
 * @file The main entry point for the React application.
 * This file handles the following:
 * - Initializes the logger and performance monitor.
 * - Registers the service worker for PWA capabilities.
 * - Renders the root React component (`App`) into the DOM.
 * - Wraps the application with essential providers like `StrictMode`, `ErrorBoundary`, and `AuthProvider`.
 * - Measures the application's load time.
 */

logger.info('Application initializing');

// Mark the start time for performance measurement.
performanceMonitor.mark('app-start');

// Register the service worker for offline capabilities and caching.
registerServiceWorker().then((registration) => {
  if (registration) {
    logger.info('PWA capabilities enabled');
  }
});

// Find the root DOM element to mount the application.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element with ID "root". The application cannot be mounted.');
}

// Create a React root and render the application.
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);

// Add a 'load' event listener to measure the total application load time.
window.addEventListener('load', () => {
  performanceMonitor.mark('app-loaded');
  performanceMonitor.measure('app-load-time', 'app-start', 'app-loaded');
});
