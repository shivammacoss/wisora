import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '@common/errors';
import { hashPassword, comparePassword } from '@common/utils/password';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type JwtPayload,
} from '@common/utils/jwt';
import { sha256, safeEqual, randomToken } from '@common/utils/token';
import { logger } from '@common/utils/logger';
import { Currency, AuthProvider } from '@common/constants';
import { env, isProduction } from '@config/env';
import { verifyGoogleIdToken } from '@integrations/google/google.verifier';
import { emailService } from '@integrations/email/email.service';
import type { IAuthRepository } from './auth.repository';
import type { UserDocument } from './auth.model';
import type { AuthResultDto, AuthUserDto, LoginDto, RegisterDto } from './auth.dto';

/** How long a password-reset link stays valid. */
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Business logic for authentication. Framework-agnostic: no req/res here.
 * Depends on the repository INTERFACE (DIP) so it is fully unit-testable.
 *
 * Token strategy:
 *  - Short-lived access token (Bearer) for API calls.
 *  - Long-lived refresh token, ROTATED on every use. We persist only its
 *    SHA-256 hash and detect reuse (a stolen/old token is rejected and the
 *    session is revoked).
 */
export class AuthService {
  constructor(private readonly repo: IAuthRepository) {}

  async register(dto: RegisterDto): Promise<AuthResultDto> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new ConflictError('Email is already registered');

    const password = await hashPassword(dto.password);
    const user = await this.repo.create({
      name: dto.name,
      email: dto.email,
      password,
      currency: dto.currency ?? Currency.INR,
    });

    return this.issueTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthResultDto> {
    const user = await this.repo.findByEmail(dto.email, true);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    // Account created via Google has no password set.
    if (!user.password) {
      throw new UnauthorizedError('This account uses Google sign-in. Continue with Google.');
    }

    const ok = await comparePassword(dto.password, user.password);
    if (!ok) throw new UnauthorizedError('Invalid credentials');

    return this.issueTokens(user);
  }

  /**
   * Sign in (or sign up) with a Google ID token. The token is verified against
   * Google, then we find the user by email — creating one on first sign-in, or
   * linking the Google id to an existing local account.
   */
  async loginWithGoogle(idToken: string): Promise<AuthResultDto> {
    const profile = await verifyGoogleIdToken(idToken);

    let user = await this.repo.findByEmail(profile.email);
    if (!user) {
      user = await this.repo.create({
        name: profile.name,
        email: profile.email,
        provider: AuthProvider.GOOGLE,
        googleId: profile.googleId,
        currency: Currency.INR,
      });
    } else if (!user.googleId) {
      await this.repo.linkGoogleAccount(user.id, profile.googleId);
    }

    return this.issueTokens(user);
  }

  /** Validate a refresh token, rotate it, and issue a fresh token pair. */
  async refresh(refreshToken: string): Promise<AuthResultDto> {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await this.repo.findById(payload.sub, true);
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedError('Session expired, please log in again');
    }

    // Reuse / mismatch detection: revoke the session entirely on failure.
    if (!safeEqual(user.refreshTokenHash, sha256(refreshToken))) {
      await this.repo.setRefreshTokenHash(user.id, null);
      throw new UnauthorizedError('Refresh token reuse detected, please log in again');
    }

    return this.issueTokens(user); // rotates the stored hash
  }

  /** Revoke the current session by clearing the stored refresh-token hash. */
  async logout(userId: string): Promise<void> {
    await this.repo.setRefreshTokenHash(userId, null);
  }

  /**
   * Start the forgot-password flow. Generates a single-use, time-limited token,
   * stores only its hash, and emails a reset link. Always resolves the same way
   * whether or not the email exists (no account enumeration). Returns the reset
   * URL so the controller can expose it in development for easy testing.
   */
  async requestPasswordReset(email: string): Promise<{ resetUrl?: string }> {
    const user = await this.repo.findByEmail(email);
    if (!user) return {}; // don't reveal whether the account exists

    const rawToken = randomToken(32);
    const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await this.repo.setPasswordResetToken(user.id, sha256(rawToken), expires);

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;

    // Only attempt email if SMTP is actually configured; otherwise skip quietly.
    if (env.SMTP_HOST) {
      await emailService.sendPasswordReset(user.email, resetUrl).catch((err) => {
        logger.warn(`Password reset email could not be sent: ${(err as Error).message}`);
      });
    }

    // In dev, log the link so it's testable without a working mailbox.
    if (!isProduction) logger.info(`🔑 Password reset link for ${user.email}: ${resetUrl}`);

    return { resetUrl };
  }

  /** Complete the reset: validate the token, set a new password, kill sessions. */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.repo.findByValidResetToken(sha256(token));
    if (!user) throw new BadRequestError('This reset link is invalid or has expired');

    const passwordHash = await hashPassword(newPassword);
    await this.repo.completePasswordReset(user.id, passwordHash);
  }

  /** Current authenticated user's public profile. */
  async me(userId: string): Promise<AuthUserDto> {
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return this.toAuthUser(user);
  }

  private async issueTokens(user: UserDocument): Promise<AuthResultDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Persist only the hash — the raw refresh token never touches the DB.
    await this.repo.setRefreshTokenHash(user.id, sha256(refreshToken));

    return { user: this.toAuthUser(user), tokens: { accessToken, refreshToken } };
  }

  private toAuthUser(user: UserDocument): AuthUserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      currency: user.currency,
    };
  }
}
