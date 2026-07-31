import type { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import type { AuthenticatedRequest } from '@common/interfaces';
import { ChaptersService } from './chapters.service';

const service = new ChaptersService();

export class ChaptersController {
  /** Public: fetch a chapter's authored content (null when not authored yet). */
  static async getContent(req: Request, res: Response): Promise<Response> {
    const { bookSlug, chapterOrder } = req.params;
    const content = await service.getContent(bookSlug, Number(chapterOrder));
    return ApiResponse.success(res, content);
  }

  /** Admin: create or replace a chapter's content. */
  static async saveContent(req: Request, res: Response): Promise<Response> {
    const { user } = req as AuthenticatedRequest;
    const { bookSlug, chapterOrder } = req.params;
    const { blocks, title, essence } = req.body;
    const saved = await service.saveContent(
      bookSlug,
      Number(chapterOrder),
      { blocks, title, essence },
      user!.sub,
    );
    return ApiResponse.success(res, saved);
  }
}
