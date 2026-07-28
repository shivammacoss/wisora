import { Router } from 'express';
import { authenticate, authorize, validate } from '@common/middlewares';
import { asyncHandler } from '@common/utils/asyncHandler';
import { UserRole } from '@common/constants';
import { FeedbackController } from './feedback.controller';
import { createFeedbackSchema, replyFeedbackSchema } from './feedback.validation';

const router = Router();

// Everything here requires a signed-in user.
router.use(authenticate);

// User-facing.
router.post('/', validate({ body: createFeedbackSchema }), asyncHandler(FeedbackController.create));
router.get('/mine', asyncHandler(FeedbackController.mine));

// Admin-only.
router.get('/', authorize(UserRole.ADMIN), asyncHandler(FeedbackController.list));
router.patch(
  '/:id/reply',
  authorize(UserRole.ADMIN),
  validate({ body: replyFeedbackSchema }),
  asyncHandler(FeedbackController.reply),
);

export const feedbackRoutes = router;
