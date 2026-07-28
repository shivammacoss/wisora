import type { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import type { AuthenticatedRequest } from '@common/interfaces';
import { FeedbackService } from './feedback.service';

const service = new FeedbackService();

export class FeedbackController {
  /** User: submit feedback. */
  static async create(req: Request, res: Response): Promise<Response> {
    const { user } = req as AuthenticatedRequest;
    const created = await service.create(user!.sub, req.body);
    return ApiResponse.created(res, created);
  }

  /** User: my own feedback threads. */
  static async mine(req: Request, res: Response): Promise<Response> {
    const { user } = req as AuthenticatedRequest;
    const items = await service.listMine(user!.sub);
    return ApiResponse.success(res, items);
  }

  /** Admin: list all feedback. */
  static async list(req: Request, res: Response): Promise<Response> {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 50);
    const result = await service.listAll(page, limit);
    return ApiResponse.success(res, result.items, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  }

  /** Admin: reply to a piece of feedback. */
  static async reply(req: Request, res: Response): Promise<Response> {
    const updated = await service.reply(req.params.id, req.body.reply);
    return ApiResponse.success(res, updated);
  }
}
