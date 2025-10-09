import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

/**
 * @class SupabaseService
 * @description A service to manage the Supabase client instance.
 */
class SupabaseService {
  /**
   * The singleton instance of the SupabaseClient.
   * @private
   * @static
   * @type {SupabaseClient}
   */
  private static instance: SupabaseClient;

  /**
   * Gets the singleton instance of the Supabase client.
   * Initializes the client if it doesn't exist.
   * @returns {SupabaseClient} The Supabase client instance.
   */
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

/**
 * The singleton Supabase client instance.
 * @type {SupabaseClient}
 */
export const supabase = SupabaseService.getClient();
