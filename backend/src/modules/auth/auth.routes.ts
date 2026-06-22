import { Router } from 'express';
import { validate, authenticate } from '@common/middlewares';
import { asyncHandler } from '@common/utils/asyncHandler';
import { AuthController } from './auth.controller';
import {
  registerSchema,
  loginSchema,
  googleSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation';

const router = Router();

// Public
router.post('/register', validate({ body: registerSchema }), asyncHandler(AuthController.register));
router.post('/login', validate({ body: loginSchema }), asyncHandler(AuthController.login));
router.post('/google', validate({ body: googleSchema }), asyncHandler(AuthController.googleLogin));
router.post('/refresh', asyncHandler(AuthController.refresh));
router.post(
  '/forgot-password',
  validate({ body: forgotPasswordSchema }),
  asyncHandler(AuthController.forgotPassword),
);
router.post(
  '/reset-password',
  validate({ body: resetPasswordSchema }),
  asyncHandler(AuthController.resetPassword),
);

// Authenticated
router.post('/logout', authenticate, asyncHandler(AuthController.logout));
router.get('/me', authenticate, asyncHandler(AuthController.me));

export const authRoutes = router;
