import mongoose from 'mongoose';
import { env, isProduction } from './env';
import { logger } from '@common/utils/logger';

// Holds the in-memory server instance (dev fallback only) so we can stop it.
let memoryServer: { stop: () => Promise<boolean> } | null = null;

// Becomes true once we have a working connection. Until then we stay quiet so
// the EXPECTED dev fallback (real Mongo unreachable) doesn't spam the console.
let connectionReady = false;

mongoose.set('strictQuery', true);

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Listeners are attached once. They no-op until a connection is established,
// which keeps the initial failed attempt (during fallback) from logging noise —
// and still avoids an "unhandled error event" crash because a listener exists.
mongoose.connection.on('error', (err) => {
  if (connectionReady) logger.error(`MongoDB error: ${err.message}`);
});
mongoose.connection.on('disconnected', () => {
  if (connectionReady) logger.warn('MongoDB disconnected');
});

/**
 * Mongoose connection lifecycle. Tries the configured MongoDB first; in
 * development, if it is unreachable, falls back to an in-memory MongoDB so the
 * app runs with zero local setup. In production a failed connection is fatal.
 */
export async function connectDatabase(uri: string = env.MONGODB_URI): Promise<typeof mongoose> {
  // Retry a few times — the Atlas TLS handshake can fail intermittently on
  // Windows (antivirus/firewall TLS inspection); a retry usually succeeds.
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        family: 4, // force IPv4 — avoids intermittent IPv6/TLS issues on Windows
        retryWrites: true,
        retryReads: true,
      });
      connectionReady = true;
      logger.info('🗄️  MongoDB connected');
      return mongoose;
    } catch (err) {
      lastError = err;
      logger.warn(
        `MongoDB connect attempt ${attempt}/${MAX_ATTEMPTS} failed: ${(err as Error).message}`,
      );
      if (attempt < MAX_ATTEMPTS) await delay(RETRY_DELAY_MS);
    }
  }

  if (isProduction) throw lastError;
  return connectInMemory(uri, lastError);
}

/** Dev-only fallback: spin up an ephemeral in-memory MongoDB. */
async function connectInMemory(uri: string, originalError: unknown): Promise<typeof mongoose> {
  try {
    logger.warn(`MongoDB not reachable at ${uri} — using an in-memory MongoDB (dev only).`);
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    memoryServer = mem;
    await mongoose.connect(mem.getUri());
    connectionReady = true;
    logger.info('🧪 In-memory MongoDB ready (data is NOT persisted across restarts).');
    return mongoose;
  } catch {
    // Surface the original error — that is the one the developer needs to fix.
    throw originalError;
  }
}

export async function disconnectDatabase(): Promise<void> {
  connectionReady = false;
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
