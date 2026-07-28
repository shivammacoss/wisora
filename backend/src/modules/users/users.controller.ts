import type { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import type { AuthenticatedRequest } from '@common/interfaces';
import { UserService } from './users.service';
import { UserRepository } from './users.repository';

const userService = new UserService(new UserRepository());

export class UserController {
  /** Admin-only: paginated list of all users. */
  static async list(req: Request, res: Response): Promise<Response> {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const result = await userService.list(page, limit);
    return ApiResponse.success(res, result.items, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  }

  /** Current user's profile. */
  static async me(req: Request, res: Response): Promise<Response> {
    const { user } = req as AuthenticatedRequest;
    const profile = await userService.getProfile(user!.sub);
    return ApiResponse.success(res, profile);
  }

  /** Update the current user's profile (name / currency). */
  static async updateMe(req: Request, res: Response): Promise<Response> {
    const { user } = req as AuthenticatedRequest;
    const profile = await userService.updateProfile(user!.sub, req.body);
    return ApiResponse.success(res, profile);
  }

  /** Admin: change a user's role (user ↔ admin). */
  static async updateRole(req: Request, res: Response): Promise<Response> {
    const { user } = req as AuthenticatedRequest;
    const updated = await userService.changeRole(req.params.id, user!.sub, req.body.role);
    return ApiResponse.success(res, updated);
  }

  /** Admin: delete a user. */
  static async remove(req: Request, res: Response): Promise<Response> {
    const { user } = req as AuthenticatedRequest;
    await userService.remove(req.params.id, user!.sub);
    return ApiResponse.success(res, { id: req.params.id });
  }
}
