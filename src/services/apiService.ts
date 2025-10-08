import { supabase } from './supabase';
import { logger } from '../utils/logger';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

/**
 * A type alias for a Supabase query promise.
 * @template T - The expected type of the data in the response.
 */
type SupabaseQuery<T> = Promise<PostgrestSingleResponse<T>>;

/**
 * Handles the response from a Supabase query, logging any errors and throwing an exception.
 * @template T - The expected type of the data in the response.
 * @param {SupabaseQuery<T>} query - The Supabase query promise to handle.
 * @returns {Promise<T>} The data from the response.
 * @throws {Error} If the query returns an error.
 */
async function handleResponse<T>(
  query: SupabaseQuery<T>
): Promise<T> {
  const { data, error } = await query;

  if (error) {
    logger.error('API Error', {
      message: error.message,
      details: error.details,
      code: error.code,
    });
    throw new Error(error.message);
  }

  return data as T;
}

/**
 * A centralized API service for interacting with the Supabase backend.
 * This service provides a consistent way to handle requests and responses,
 * with built-in error logging.
 */
export const apiService = {
  /**
   * Performs a GET request.
   * @template T - The expected type of the data.
   * @param {SupabaseQuery<T>} query - The Supabase query to execute.
   * @returns {Promise<T>} The response data.
   */
  async get<T>(query: SupabaseQuery<T>): Promise<T> {
    return handleResponse(query);
  },

  /**
   * Performs a POST request.
   * @template T - The expected type of the data.
   * @param {SupabaseQuery<T>} query - The Supabase query to execute.
   * @returns {Promise<T>} The response data.
   */
  async post<T>(query: SupabaseQuery<T>): Promise<T> {
    return handleResponse(query);
  },

  /**
   * Performs a PUT request.
   * @template T - The expected type of the data.
   * @param {SupabaseQuery<T>} query - The Supabase query to execute.
   * @returns {Promise<T>} The response data.
   */
  async put<T>(query: SupabaseQuery<T>): Promise<T> {
    return handleResponse(query);
  },

  /**
   * Performs a DELETE request.
   * @template T - The expected type of the data.
   * @param {SupabaseQuery<T>} query - The Supabase query to execute.
   * @returns {Promise<T>} The response data.
   */
  async delete<T>(query: SupabaseQuery<T>): Promise<T> {
    return handleResponse(query);
  },
};

// Example usage (for demonstration):
/*
  const fetchUsers = async () => {
    try {
      const users = await apiService.get(supabase.from('users').select('*'));
      console.log(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };
*/