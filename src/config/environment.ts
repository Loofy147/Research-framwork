import type { AppConfig, Environment } from '../types';

/**
 * Determines the current application environment based on the `MODE` environment variable.
 * @returns {Environment} The current environment ('production', 'staging', or 'development').
 */
const getEnvironment = (): Environment => {
  const mode = import.meta.env.MODE;
  if (mode === 'production') return 'production';
  if (mode === 'staging') return 'staging';
  return 'development';
};

/**
 * Application configuration object.
 * It pulls values from Vite environment variables.
 * @type {AppConfig}
 */
export const config: AppConfig = {
  /**
   * The URL for the Supabase project.
   * @type {string}
   */
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  /**
   * The anonymous key for the Supabase project.
   * @type {string}
   */
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  /**
   * The current application environment.
   * @type {Environment}
   */
  environment: getEnvironment(),
  /**
   * The version of the application.
   * @type {string}
   */
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

/**
 * A boolean flag indicating if the application is running in the development environment.
 * @type {boolean}
 */
export const isDevelopment = config.environment === 'development';
/**
 * A boolean flag indicating if the application is running in the production environment.
 * @type {boolean}
 */
export const isProduction = config.environment === 'production';
