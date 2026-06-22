import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { MongooseError } from 'mongoose';
import { AppError } from '@common/errors';
import { ApiResponse } from '@common/utils/ApiResponse';
import { logger } from '@common/utils/logger';

/** Detects low-level DB/TLS connectivity failures so we can show a clean message. */
function isDatabaseError(err: unknown): boolean {
  const name = (err as { name?: string })?.name ?? '';
  const message = (err as Error)?.message ?? '';
  return (
    err instanceof MongooseError ||
    /Mongo|ServerSelection|topology|ECONNREFUSED|ETIMEDOUT/i.test(name) ||
    /Mongo|ServerSelection|ssl|tls|ECONNREFUSED|ETIMEDOUT/i.test(message)
  );
}

/**
 * Central error middleware — the single place that converts any thrown error
 * into the standard { success, data, error, meta } response.
 * Internal/unexpected errors are logged in full server-side but NEVER leaked to
 * the client (no raw stack traces, SSL/driver messages, etc.).
 * Must be registered LAST, after all routes.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Zod validation errors → 422 with field details.
  if (err instanceof ZodError) {
    return ApiResponse.error(res, 'Validation failed', 422, err.flatten().fieldErrors);
  }

  // Known, operational errors carry a safe, user-facing message.
  if (err instanceof AppError) {
    if (!err.isOperational) logger.error(err.message, { stack: err.stack });
    return ApiResponse.error(res, err.message, err.statusCode, err.details);
  }

  // Database/network connectivity issues → friendly 503 (detail logged only).
  if (isDatabaseError(err)) {
    logger.error('Database/connectivity error', { error: (err as Error).message });
    return ApiResponse.error(
      res,
      'We are having trouble reaching the database right now. Please try again in a moment.',
      503,
    );
  }

  // Anything else: log full detail server-side, return a generic message.
  logger.error('Unhandled error', { error: err });
  return ApiResponse.error(res, 'Something went wrong on our end. Please try again.', 500);
};
