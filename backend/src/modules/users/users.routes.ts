import { Router } from 'express';
import { authenticate, authorize, validate } from '@common/middlewares';
import { asyncHandler } from '@common/utils/asyncHandler';
import { UserRole } from '@common/constants';
import { UserController } from './users.controller';
import { listUsersQuerySchema, updateProfileSchema } from './users.validation';

const router = Router();

// All routes require a valid access token.
router.use(authenticate);

// Admin-only — demonstrates role-based authorization (RBAC).
router.get(
  '/',
  authorize(UserRole.ADMIN),
  validate({ query: listUsersQuerySchema }),
  asyncHandler(UserController.list),
);

// Self-service profile.
router.get('/me', asyncHandler(UserController.me));
router.patch('/me', validate({ body: updateProfileSchema }), asyncHandler(UserController.updateMe));

export const userRoutes = router;
