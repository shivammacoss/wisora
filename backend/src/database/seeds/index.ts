import { connectDatabase, disconnectDatabase } from '@config/database';
import { logger } from '@common/utils/logger';

/**
 * Seed entrypoint. Run with `npm run seed`.
 * Add per-module seeders (books, chapters…) and call them here.
 */
async function seed(): Promise<void> {
  await connectDatabase();
  logger.info('🌱 Seeding database…');

  // TODO: await seedBooks(); await seedChapters();

  logger.info('✅ Seeding complete');
  await disconnectDatabase();
  process.exit(0);
}

void seed();
