import { Router } from 'express';
import { authenticate, authorize, validate } from '@common/middlewares';
import { asyncHandler } from '@common/utils/asyncHandler';
import { UserRole } from '@common/constants';
import { ChaptersController } from './chapters.controller';
import {
  addChapterSchema,
  bookSlugParamsSchema,
  chapterParamsSchema,
  initChaptersSchema,
  reorderChaptersSchema,
  saveContentSchema,
} from './chapters.validation';

const router = Router();

const admin = [authenticate, authorize(UserRole.ADMIN)];

// Admin: "Recently deleted" — declared before the :bookSlug routes so the
// literal "deleted" segment isn't captured as a book slug.
router.get('/deleted', ...admin, asyncHandler(ChaptersController.deletedList));
router.post('/deleted/:id/recover', ...admin, asyncHandler(ChaptersController.recover));
router.delete('/deleted/:id', ...admin, asyncHandler(ChaptersController.permanentDelete));

// Public: the backend-managed chapter list for a book (empty when unmanaged).
router.get('/:bookSlug', validate({ params: bookSlugParamsSchema }), asyncHandler(ChaptersController.list));

// Public: a chapter's authored content.
router.get(
  '/:bookSlug/:chapterOrder',
  validate({ params: chapterParamsSchema }),
  asyncHandler(ChaptersController.getContent),
);

// Admin: seed the list from bundled chapters (once per book).
router.post(
  '/:bookSlug/init',
  ...admin,
  validate({ params: bookSlugParamsSchema, body: initChaptersSchema }),
  asyncHandler(ChaptersController.init),
);

// Admin: add a chapter to the end of the list.
router.post(
  '/:bookSlug',
  ...admin,
  validate({ params: bookSlugParamsSchema, body: addChapterSchema }),
  asyncHandler(ChaptersController.add),
);

// Admin: reorder the list (must be declared before the :chapterOrder PUT).
router.put(
  '/:bookSlug/reorder',
  ...admin,
  validate({ params: bookSlugParamsSchema, body: reorderChaptersSchema }),
  asyncHandler(ChaptersController.reorder),
);

// Admin: create or replace a chapter's content (text or parsed doc).
router.put(
  '/:bookSlug/:chapterOrder',
  ...admin,
  validate({ params: chapterParamsSchema, body: saveContentSchema }),
  asyncHandler(ChaptersController.saveContent),
);

// Admin: delete a chapter.
router.delete(
  '/:bookSlug/:chapterOrder',
  ...admin,
  validate({ params: chapterParamsSchema }),
  asyncHandler(ChaptersController.remove),
);

export const chapterRoutes = router;
