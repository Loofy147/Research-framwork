import { supabase } from './supabase';
import { withRetry, CircuitBreaker } from '../utils/retry';
import { logger } from '../utils/logger';
import type { ApiResponse } from '../types';

/**
 * A circuit breaker to prevent repeated calls to a failing service.
 * @type {CircuitBreaker}
 */
const circuitBreaker = new CircuitBreaker(5, 60000, 30000);

/**
 * @class ApiService
 * @description A singleton service for interacting with the Supabase API.
 * It includes features like retry logic, circuit breaker, and logging.
 */
export class ApiService {
  /**
   * The singleton instance of the ApiService.
   * @private
   * @static
   * @type {ApiService}
   */
  private static instance: ApiService;

  /**
   * The private constructor to prevent direct instantiation.
   * @private
   */
  private constructor() {}

  /**
   * Gets the singleton instance of the ApiService.
   * @returns {ApiService} The singleton instance.
   */
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Performs a query on a Supabase table.
   * @template T
   * @param {string} table - The name of the table to query.
   * @param {object} [options={}] - The query options.
   * @param {string} [options.select='*'] - The columns to select.
   * @param {Record<string, unknown>} [options.filters] - The filters to apply to the query.
   * @param {object} [options.order] - The ordering of the results.
   * @param {string} options.order.column - The column to order by.
   * @param {boolean} [options.order.ascending=true] - Whether to sort in ascending order.
   * @param {number} [options.limit] - The maximum number of results to return.
   * @returns {Promise<ApiResponse<T[]>>} A promise that resolves with the query results.
   */
  async query<T>(
    table: string,
    options: {
      select?: string;
      filters?: Record<string, unknown>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    } = {}
  ): Promise<ApiResponse<T[]>> {
    try {
      return await circuitBreaker.execute(async () => {
        return await withRetry(
          async () => {
            let query = supabase.from(table).select(options.select || '*');

            if (options.filters) {
              Object.entries(options.filters).forEach(([key, value]) => {
                query = query.eq(key, value);
              });
            }

            if (options.order) {
              query = query.order(options.order.column, {
                ascending: options.order.ascending ?? true,
              });
            }

            if (options.limit) {
              query = query.limit(options.limit);
            }

            const { data, error } = await query;

            if (error) {
              logger.error('Query failed', { table, error: error.message });
              return { data: null, error: { message: error.message, code: error.code }, status: 500 };
            }

            return { data: data as T[], error: null, status: 200 };
          },
          { maxAttempts: 3, delayMs: 1000, backoff: 'exponential' }
        );
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('API query failed', { table, error: message });
      return { data: null, error: { message }, status: 500 };
    }
  }

  /**
   * Creates a new record in a Supabase table.
   * @template T
   * @param {string} table - The name of the table to create the record in.
   * @param {Partial<T>} data - The data for the new record.
   * @returns {Promise<ApiResponse<T>>} A promise that resolves with the created record.
   */
  async create<T>(table: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      return await circuitBreaker.execute(async () => {
        return await withRetry(
          async () => {
            const { data: result, error } = await supabase
              .from(table)
              .insert(data)
              .select()
              .single();

            if (error) {
              logger.error('Create failed', { table, error: error.message });
              return { data: null, error: { message: error.message, code: error.code }, status: 500 };
            }

            return { data: result as T, error: null, status: 201 };
          },
          { maxAttempts: 3, delayMs: 1000 }
        );
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('API create failed', { table, error: message });
      return { data: null, error: { message }, status: 500 };
    }
  }

  /**
   * Updates an existing record in a Supabase table.
   * @template T
   * @param {string} table - The name of the table to update the record in.
   * @param {string} id - The ID of the record to update.
   * @param {Partial<T>} data - The updated data for the record.
   * @returns {Promise<ApiResponse<T>>} A promise that resolves with the updated record.
   */
  async update<T>(
    table: string,
    id: string,
    data: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      return await circuitBreaker.execute(async () => {
        return await withRetry(
          async () => {
            const { data: result, error } = await supabase
              .from(table)
              .update(data)
              .eq('id', id)
              .select()
              .single();

            if (error) {
              logger.error('Update failed', { table, id, error: error.message });
              return { data: null, error: { message: error.message, code: error.code }, status: 500 };
            }

            return { data: result as T, error: null, status: 200 };
          },
          { maxAttempts: 3, delayMs: 1000 }
        );
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('API update failed', { table, id, error: message });
      return { data: null, error: { message }, status: 500 };
    }
  }

  /**
   * Deletes a record from a Supabase table.
   * @param {string} table - The name of the table to delete the record from.
   * @param {string} id - The ID of the record to delete.
   * @returns {Promise<ApiResponse<null>>} A promise that resolves when the record is deleted.
   */
  async delete(table: string, id: string): Promise<ApiResponse<null>> {
    try {
      return await circuitBreaker.execute(async () => {
        return await withRetry(
          async () => {
            const { error } = await supabase.from(table).delete().eq('id', id);

            if (error) {
              logger.error('Delete failed', { table, id, error: error.message });
              return { data: null, error: { message: error.message, code: error.code }, status: 500 };
            }

            return { data: null, error: null, status: 204 };
          },
          { maxAttempts: 3, delayMs: 1000 }
        );
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('API delete failed', { table, id, error: message });
      return { data: null, error: { message }, status: 500 };
    }
  }

  /**
   * Gets the current state of the circuit breaker.
   * @returns {string} The state of the circuit breaker.
   */
  getCircuitBreakerState(): string {
    return circuitBreaker.getState();
  }

  /**
   * Resets the circuit breaker.
   */
  resetCircuitBreaker(): void {
    circuitBreaker.reset();
  }
}

/**
 * The singleton instance of the ApiService.
 * @type {ApiService}
 */
export const apiService = ApiService.getInstance();
