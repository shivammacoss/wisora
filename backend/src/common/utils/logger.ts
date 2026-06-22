import winston from 'winston';
import { env, isProduction } from '@config/env';

/**
 * Centralized structured logger. JSON in production (for log aggregators),
 * colorized human-readable output in development.
 */
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: isProduction
    ? winston.format.combine(winston.format.timestamp(), winston.format.json())
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} ${level}: ${message}${
              Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
            }`,
        ),
      ),
  transports: [new winston.transports.Console()],
});
