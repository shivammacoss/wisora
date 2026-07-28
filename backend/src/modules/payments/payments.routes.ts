import { Router } from 'express';
import { authenticate, authorize, validate } from '@common/middlewares';
import { asyncHandler } from '@common/utils/asyncHandler';
import { UserRole } from '@common/constants';
import { PaymentsController } from './payments.controller';
import { createOrderSchema, verifyPaymentSchema } from './payments.validation';

const router = Router();

// Public: the client-side library owns unlock state, so these mirror the app's
// current (unauthenticated) ownership model. The global rate limiter applies.
// Signature verification — not the auth layer — is what protects `verify`.
router.post('/order', validate({ body: createOrderSchema }), asyncHandler(PaymentsController.createOrder));
router.post('/verify', validate({ body: verifyPaymentSchema }), asyncHandler(PaymentsController.verify));

// Admin-only: payment history.
router.get(
  '/history',
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(PaymentsController.history),
);

export const paymentRoutes = router;
