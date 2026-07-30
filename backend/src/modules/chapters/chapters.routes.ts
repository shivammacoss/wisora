import { Router } from 'express';
import { authenticate, authorize, validate } from '@common/middlewares';
import { asyncHandler } from '@common/utils/asyncHandler';
import { UserRole } from '@common/constants';
import { ChaptersController } from './chapters.controller';
import { chapterParamsSchema, saveContentSchema } from './chapters.validation';

const router = Router();

// Public: readers fetch a chapter's authored content.
router.get(
  '/:bookSlug/:chapterOrder',
  validate({ params: chapterParamsSchema }),
  asyncHandler(ChaptersController.getContent),
);

// Admin-only: create or replace a chapter's content (text or parsed doc).
router.put(
  '/:bookSlug/:chapterOrder',
  authenticate,
  authorize(UserRole.ADMIN),
  validate({ params: chapterParamsSchema, body: saveContentSchema }),
  asyncHandler(ChaptersController.saveContent),
);

export const chapterRoutes = router;
