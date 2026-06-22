import { UserModel, type UserDocument } from './auth.model';

/**
 * Data-access layer for users. The ONLY place that talks to Mongoose for auth.
 * Defined as a class so it can be injected into the service and mocked in tests.
 */
export interface IAuthRepository {
  create(data: Partial<UserDocument>): Promise<UserDocument>;
  findByEmail(email: string, withSecret?: boolean): Promise<UserDocument | null>;
  findById(id: string, withSecret?: boolean): Promise<UserDocument | null>;
  setRefreshTokenHash(id: string, hash: string | null): Promise<void>;
  linkGoogleAccount(id: string, googleId: string): Promise<void>;
  setPasswordResetToken(id: string, tokenHash: string, expires: Date): Promise<void>;
  findByValidResetToken(tokenHash: string): Promise<UserDocument | null>;
  completePasswordReset(id: string, passwordHash: string): Promise<void>;
}

export class AuthRepository implements IAuthRepository {
  create(data: Partial<UserDocument>): Promise<UserDocument> {
    return UserModel.create(data);
  }

  async linkGoogleAccount(id: string, googleId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { googleId }).exec();
  }

  findByEmail(email: string, withSecret = false): Promise<UserDocument | null> {
    const query = UserModel.findOne({ email: email.toLowerCase() });
    return (withSecret ? query.select('+password +refreshTokenHash') : query).exec();
  }

  findById(id: string, withSecret = false): Promise<UserDocument | null> {
    const query = UserModel.findById(id);
    return (withSecret ? query.select('+refreshTokenHash') : query).exec();
  }

  async setRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    // $unset when clearing so the field truly leaves the document on logout.
    const update = hash ? { refreshTokenHash: hash } : { $unset: { refreshTokenHash: 1 } };
    await UserModel.findByIdAndUpdate(id, update).exec();
  }

  async setPasswordResetToken(id: string, tokenHash: string, expires: Date): Promise<void> {
    await UserModel.findByIdAndUpdate(id, {
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: expires,
    }).exec();
  }

  findByValidResetToken(tokenHash: string): Promise<UserDocument | null> {
    return UserModel.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    })
      .select('+passwordResetTokenHash +passwordResetExpires')
      .exec();
  }

  async completePasswordReset(id: string, passwordHash: string): Promise<void> {
    // Set the new password and invalidate the reset token + all sessions.
    await UserModel.findByIdAndUpdate(id, {
      password: passwordHash,
      $unset: { passwordResetTokenHash: 1, passwordResetExpires: 1, refreshTokenHash: 1 },
    }).exec();
  }
}
