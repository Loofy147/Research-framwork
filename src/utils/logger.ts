/**
 * @file Configures and exports a centralized pino logger instance.
 */

import pino from 'pino';

/**
 * Creates a centralized logger for the application.
 * In a production environment, you would typically configure transports
 * to ship logs to a service like Datadog, New Relic, or a custom logging stack.
 */
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

export default logger;
