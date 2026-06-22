import type { RequestHandler } from 'express';
import { NotFoundError } from '@common/errors';

/** Catches requests to undefined routes and forwards a 404 to the error handler. */
export const notFound: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};
