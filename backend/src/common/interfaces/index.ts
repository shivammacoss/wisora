import type { Request } from 'express';
import type { JwtPayload } from '@common/utils/jwt';

/** Request augmented by the auth middleware with the decoded JWT user. */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/** Pagination query contract shared by list endpoints. */
export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
