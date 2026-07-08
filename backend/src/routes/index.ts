import { Router } from 'express';
import { rateLimiter } from '@common/middlewares';
import { authRoutes } from '@modules/auth';
import { userRoutes } from '@modules/users';
import { paymentRoutes } from '@modules/payments';

/**
 * API v1 router. Every module mounts its own router here.
 * Add a new module: import its router and `.use()` it below.
 */
const v1 = Router();

v1.use(rateLimiter);

v1.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' }, error: null });
});

v1.use('/auth', authRoutes);
v1.use('/users', userRoutes);
v1.use('/payments', paymentRoutes);
// v1.use('/books', bookRoutes);
// v1.use('/chapters', chapterRoutes);
// v1.use('/library', libraryRoutes);

export const apiRouter = v1;
