import rateLimit from 'express-rate-limit';
import { env } from '@config/env';

/** Global IP-based rate limiter. Mount on the API router. */
export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, data: null, error: { message: 'Too many requests, slow down.' } },
});
