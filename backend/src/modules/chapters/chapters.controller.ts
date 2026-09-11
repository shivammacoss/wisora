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

  /* ── managed chapter list ── */

  /** Public: the backend-managed chapter list for a book (empty if unmanaged). */
  static async list(req: Request, res: Response): Promise<Response> {
    const items = await service.listManaged(req.params.bookSlug);
    return ApiResponse.success(res, items);
  }

  /** Admin: seed the list from the bundled chapters (once per book). */
  static async init(req: Request, res: Response): Promise<Response> {
    const items = await service.initFromBundled(req.params.bookSlug, req.body.chapters);
    return ApiResponse.success(res, items);
  }

  /** Admin: add a new chapter at the end. */
  static async add(req: Request, res: Response): Promise<Response> {
    const { title, readingTimeMins, isFree } = req.body;
    const created = await service.addChapter(req.params.bookSlug, { title, readingTimeMins, isFree });
    return ApiResponse.created(res, created);
  }

  /** Admin: delete a chapter (and close the gap). */
  static async remove(req: Request, res: Response): Promise<Response> {
    const items = await service.deleteChapter(req.params.bookSlug, Number(req.params.chapterOrder));
    return ApiResponse.success(res, items);
  }

  /** Admin: reorder the chapter list. */
  static async reorder(req: Request, res: Response): Promise<Response> {
    const items = await service.reorder(req.params.bookSlug, req.body.order);
    return ApiResponse.success(res, items);
  }

  /* ── recently deleted ── */

  /** Admin: all soft-deleted chapters (across books). */
  static async deletedList(_req: Request, res: Response): Promise<Response> {
    return ApiResponse.success(res, await service.listDeleted());
  }

  /** Admin: recover a soft-deleted chapter. */
  static async recover(req: Request, res: Response): Promise<Response> {
    await service.recover(req.params.id);
    return ApiResponse.success(res, { id: req.params.id });
  }

  /** Admin: permanently delete a soft-deleted chapter. */
  static async permanentDelete(req: Request, res: Response): Promise<Response> {
    await service.permanentDelete(req.params.id);
    return ApiResponse.success(res, { id: req.params.id });
  }
}
