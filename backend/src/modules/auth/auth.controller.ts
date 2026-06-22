import type { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import { UnauthorizedError } from '@common/errors';
import { setRefreshCookie, clearRefreshCookie, REFRESH_COOKIE } from '@common/utils/cookies';
import { isProduction } from '@config/env';
import type { AuthenticatedRequest } from '@common/interfaces';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

/**
 * HTTP layer: parses validated input, delegates to the service, shapes the
 * response. Never touches the database directly. The service's dependency is
 * injected here (composition root for the module).
 *
 * Tokens are returned in the JSON body (for header-based clients) AND mirrored
 * into a hardened httpOnly cookie (defense-in-depth) on every issue.
 */
const authService = new AuthService(new AuthRepository());

export class AuthController {
  static async register(req: Request, res: Response): Promise<Response> {
    const result = await authService.register(req.body);
    setRefreshCookie(res, result.tokens.refreshToken);
    return ApiResponse.created(res, result);
  }

  static async login(req: Request, res: Response): Promise<Response> {
    const result = await authService.login(req.body);
    setRefreshCookie(res, result.tokens.refreshToken);
    return ApiResponse.success(res, result);
  }

  static async googleLogin(req: Request, res: Response): Promise<Response> {
    const result = await authService.loginWithGoogle(req.body.idToken);
    setRefreshCookie(res, result.tokens.refreshToken);
    return ApiResponse.success(res, result);
  }

  static async refresh(req: Request, res: Response): Promise<Response> {
    // Accept the refresh token from the body (header clients) or the cookie.
    const token: string | undefined = req.body?.refreshToken ?? req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new UnauthorizedError('No refresh token provided');

    const result = await authService.refresh(token);
    setRefreshCookie(res, result.tokens.refreshToken);
    return ApiResponse.success(res, result);
  }

  static async logout(req: Request, res: Response): Promise<Response> {
    const { user } = req as AuthenticatedRequest;
    if (user) await authService.logout(user.sub);
    clearRefreshCookie(res);
    return ApiResponse.success(res, { message: 'Logged out' });
  }

  static async me(req: Request, res: Response): Promise<Response> {
    const { user } = req as AuthenticatedRequest;
    const profile = await authService.me(user!.sub);
    return ApiResponse.success(res, { user: profile });
  }

  static async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { resetUrl } = await authService.requestPasswordReset(req.body.email);
    const data: Record<string, unknown> = {
      message: 'If an account exists for that email, a password reset link has been sent.',
    };
    // Expose the link in development only so it can be tested without a mailbox.
    if (!isProduction && resetUrl) data.devResetUrl = resetUrl;
    return ApiResponse.success(res, data);
  }

  static async resetPassword(req: Request, res: Response): Promise<Response> {
    await authService.resetPassword(req.body.token, req.body.password);
    return ApiResponse.success(res, { message: 'Password updated. You can now log in.' });
  }
}
