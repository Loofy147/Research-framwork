import { supabase } from './supabase';
import { withRetry, CircuitBreaker } from '../utils/retry';
import { logger } from '../utils/logger';
import type { ApiResponse } from '../types';

const circuitBreaker = new CircuitBreaker(5, 60000, 30000);

export class ApiService {
  private static instance: ApiService;

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

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

  getCircuitBreakerState(): string {
    return circuitBreaker.getState();
  }

  resetCircuitBreaker(): void {
    circuitBreaker.reset();
  }
}

export const apiService = ApiService.getInstance();
