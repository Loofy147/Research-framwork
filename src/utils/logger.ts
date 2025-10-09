import { isDevelopment } from '../config/environment';

/**
 * Defines the available log levels.
 * @enum {string}
 */
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

/**
 * Represents the type for log levels.
 * @typedef {'debug' | 'info' | 'warn' | 'error'} LogLevel
 */
export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

/**
 * @class Logger
 * @description A singleton logger class for consistent logging across the application.
 * Logs to the console and can be configured to only log certain levels in development.
 */
class Logger {
  /**
   * The singleton instance of the Logger.
   * @private
   * @static
   * @type {Logger}
   */
  private static instance: Logger;

  /**
   * The private constructor to prevent direct instantiation.
   * @private
   */
  private constructor() {}

  /**
   * Gets the singleton instance of the Logger.
   * @returns {Logger} The singleton Logger instance.
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Logs a debug message. Only logs in development environment.
   * @param {string} message - The message to log.
   * @param {unknown} [data] - Optional data to include with the log.
   */
  debug(message: string, data?: unknown): void {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  /**
   * Logs an informational message. Only logs in development environment.
   * @param {string} message - The message to log.
   * @param {unknown} [data] - Optional data to include with the log.
   */
  info(message: string, data?: unknown): void {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  /**
   * Logs a warning message.
   * @param {string} message - The message to log.
   * @param {unknown} [data] - Optional data to include with the log.
   */
  warn(message: string, data?: unknown): void {
    console.warn(`[WARN] ${message}`, data);
  }

  /**
   * Logs an error message.
   * @param {string} message - The message to log.
   * @param {unknown} [error] - The error object or additional error data.
   */
  error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error);
  }
}

/**
 * The singleton instance of the Logger.
 * @type {Logger}
 */
export const logger = Logger.getInstance();
