import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

class SupabaseService {
  private static instance: SupabaseClient;

  static getClient(): SupabaseClient {
    if (!SupabaseService.instance) {
      SupabaseService.instance = createClient(
        config.supabaseUrl,
        config.supabaseAnonKey,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
        }
      );
      logger.info('Supabase client initialized');
    }
    return SupabaseService.instance;
  }
}

export const supabase = SupabaseService.getClient();
