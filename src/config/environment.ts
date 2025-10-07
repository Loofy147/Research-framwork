import type { AppConfig, Environment } from '../types';

const getEnvironment = (): Environment => {
  const mode = import.meta.env.MODE;
  if (mode === 'production') return 'production';
  if (mode === 'staging') return 'staging';
  return 'development';
};

export const config: AppConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  environment: getEnvironment(),
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production';
