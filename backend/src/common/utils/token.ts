import crypto from 'node:crypto';

/**
 * Deterministic SHA-256 hash, used to store refresh tokens at rest.
 * Tokens are high-entropy random JWTs, so a fast one-way hash (not bcrypt) is
 * the right tool: it lets us index/compare directly and avoids bcrypt's 72-byte
 * input limit. We store the hash, never the raw token.
 */
export function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/** Cryptographically-secure random token (e.g. for email verification / resets). */
export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/** Constant-time string comparison to avoid timing attacks on token checks. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
