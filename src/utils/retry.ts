import { logger } from './logger';

/**
 * @interface RetryOptions
 * @description Options for configuring the retry logic.
 * @property {number} [maxAttempts=3] - The maximum number of attempts to make.
 * @property {number} [delayMs=1000] - The base delay in milliseconds between retries.
 * @property {'linear' | 'exponential'} [backoff='exponential'] - The backoff strategy to use for delays.
 * @property {(attempt: number, error: Error) => void} [onRetry] - A callback function to execute on each retry.
 */
interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: 'linear' | 'exponential';
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Executes a function that returns a promise and retries it on failure.
 * @template T
 * @param {() => Promise<T>} fn - The asynchronous function to execute.
 * @param {RetryOptions} [options={}] - The options for the retry logic.
 * @returns {Promise<T>} A promise that resolves with the result of the function if it succeeds.
 * @throws {Error} Throws the last error if all retry attempts fail.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoff = 'exponential',
    onRetry,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts) {
        logger.error('Max retry attempts reached', { attempts: maxAttempts, error: lastError.message });
        throw lastError;
      }

      const delay = backoff === 'exponential'
        ? delayMs * Math.pow(2, attempt - 1)
        : delayMs * attempt;

      logger.warn('Retrying operation', { attempt, delay, error: lastError.message });

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * @class CircuitBreaker
 * @description Implements the circuit breaker pattern to prevent repeated calls to a failing service.
 * The circuit breaker has three states: 'closed', 'open', and 'half-open'.
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private threshold: number;
  private resetTimeout: number;

  /**
   * Creates an instance of CircuitBreaker.
   * @param {number} [threshold=5] - The number of failures before opening the circuit.
   * @param {number} [_timeout=60000] - (Unused) The timeout for the operation itself.
   * @param {number} [resetTimeout=30000] - The time in ms to wait before moving from 'open' to 'half-open'.
   */
  constructor(
    threshold = 5,
    _timeout = 60000, // Note: This parameter is not currently used in the implementation.
    resetTimeout = 30000
  ) {
    this.threshold = threshold;
    this.resetTimeout = resetTimeout;
  }

  /**
   * Executes a function through the circuit breaker.
   * @template T
   * @param {() => Promise<T>} fn - The asynchronous function to execute.
   * @returns {Promise<T>} A promise that resolves with the result of the function.
   * @throws {Error} Throws an error if the circuit is open or if the function fails.
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'half-open';
        logger.info('Circuit breaker half-open');
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handles a successful execution. Resets failures and closes the circuit if it was half-open.
   * @private
   */
  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'half-open') {
      this.state = 'closed';
      logger.info('Circuit breaker closed');
    }
  }

  /**
   * Handles a failed execution. Increments failures and opens the circuit if the threshold is reached.
   * @private
   */
  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
      logger.error('Circuit breaker opened', { failures: this.failures });
    }
  }

  /**
   * Gets the current state of the circuit breaker.
   * @returns {string} The current state ('closed', 'open', or 'half-open').
   */
  getState(): string {
    return this.state;
  }

  /**
   * Manually resets the circuit breaker to the 'closed' state.
   */
  reset(): void {
    this.failures = 0;
    this.state = 'closed';
    logger.info('Circuit breaker reset');
  }
}
