import type { RequestHandler } from 'express';
import { UnauthorizedError, ForbiddenError } from '@common/errors';
import { verifyAccessToken } from '@common/utils/jwt';
import type { AuthenticatedRequest } from '@common/interfaces';
import type { UserRole } from '@common/constants';

/** Verifies the Bearer access token and attaches the decoded user to the request. */
export const authenticate: RequestHandler = (req: AuthenticatedRequest, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or malformed Authorization header'));
  }
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

/** Guards a route by role. Use after `authenticate`. */
export const authorize =
  (...roles: UserRole[]): RequestHandler =>
  (req: AuthenticatedRequest, _res, next) => {
    if (!req.user) return next(new UnauthorizedError());
    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
