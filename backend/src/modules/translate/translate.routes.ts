import { Router } from 'express';
import { validate } from '@common/middlewares';
import { asyncHandler } from '@common/utils/asyncHandler';
import { TranslateController } from './translate.controller';
import { translateSchema } from './translate.validation';

const router = Router();

// Public: translate UI/content strings into a target language (results cached).
router.post('/', validate({ body: translateSchema }), asyncHandler(TranslateController.translate));

export const translateRoutes = router;
