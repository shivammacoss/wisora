import type { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import { TranslateService } from './translate.service';

const service = new TranslateService();

export class TranslateController {
  /** Public: translate a batch of strings into the target language (cached). */
  static async translate(req: Request, res: Response): Promise<Response> {
    const { texts, target } = req.body;
    const translations = await service.translateBatch(texts, target);
    return ApiResponse.success(res, { translations });
  }
}
