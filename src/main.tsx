import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './utils/logger';
import { registerServiceWorker } from './utils/serviceWorker';
import { performanceMonitor } from './utils/performance';

logger.info('Application initializing');

performanceMonitor.mark('app-start');

registerServiceWorker().then((registration) => {
  if (registration) {
    logger.info('PWA capabilities enabled');
  }
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

window.addEventListener('load', () => {
  performanceMonitor.mark('app-loaded');
  performanceMonitor.measure('app-load-time', 'app-start', 'app-loaded');
});
