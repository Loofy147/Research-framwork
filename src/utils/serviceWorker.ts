import { logger } from './logger';

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
            logger.info('New service worker available');
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

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    logger.info('Service Worker unregistered', { success });
    return success;
  } catch (error) {
    logger.error('Service Worker unregistration failed', error);
    return false;
  }
};
