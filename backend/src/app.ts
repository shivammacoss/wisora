import express, { type Application } from 'express';
import { env } from '@config/env';
import { loadExpress } from '@loaders/express';
import { apiRouter } from '@routes/index';
import { errorHandler, notFound } from '@common/middlewares';

/**
 * Builds and configures the Express application WITHOUT starting it.
 * Keeping `listen` out of here makes the app importable by tests (supertest).
 */
export function createApp(): Application {
  const app = express();

  loadExpress(app);

  app.use(env.API_PREFIX, apiRouter);

  // 404 + centralized error handling — must come after all routes.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
