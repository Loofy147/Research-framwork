import { logger } from './logger';

/**
 * Registers the service worker.
 * Checks for browser support and handles registration errors.
 * Listens for updates to the service worker.
 * @returns {Promise<ServiceWorkerRegistration | null>} A promise that resolves with the ServiceWorkerRegistration on success, or null on failure or if not supported.
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    logger.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    logger.info('Service Worker registered', { scope: registration.scope });

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // A new service worker is installed and ready to take over.
            // You might want to show a notification to the user here.
            logger.info('New service worker available. Please refresh.');
          }
        });
      }
    });

    return registration;
  } catch (error) {
    logger.error('Service Worker registration failed', error);
    return null;
  }
};

/**
 * Unregisters the service worker.
 * @returns {Promise<boolean>} A promise that resolves with true if the service worker was unregistered successfully, false otherwise.
 */
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    if (success) {
      logger.info('Service Worker unregistered successfully.');
    } else {
      logger.warn('Service Worker unregistration failed.');
    }
    return success;
  } catch (error) {
    logger.error('Service Worker unregistration failed with an error', error);
    return false;
  }
};
