import { isDevelopment } from '../config/environment';

export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  debug(message: string, data?: unknown): void {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: unknown): void {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: unknown): void {
    console.warn(`[WARN] ${message}`, data);
  }

  error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error);
  }
}

export const logger = Logger.getInstance();
