import { createApp } from './app';
import { env, isProduction } from '@config/env';
import { loadMongoose } from '@loaders/mongoose';
import { disconnectDatabase } from '@config/database';
import { logger } from '@common/utils/logger';
import { seedAdmin } from './database/seeds/admin.seed';

/** Process entrypoint: connect dependencies, start the HTTP server, handle shutdown. */
async function bootstrap(): Promise<void> {
  await loadMongoose();

  // Dev convenience: make sure the support@wisora.org admin always exists so the
  // admin panel is reachable locally (even on the ephemeral in-memory database).
  // In production, seed explicitly with `npm run seed`.
  if (!isProduction) {
    await seedAdmin().catch((e) => logger.warn(`admin auto-seed skipped: ${(e as Error).message}`));
  }

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Wisora API running on http://localhost:${env.PORT}${env.API_PREFIX}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason });
  });
}

void bootstrap();
