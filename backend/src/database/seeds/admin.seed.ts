import { randomBytes } from 'crypto';
import { UserModel } from '@modules/auth/auth.model';
import { hashPassword } from '@common/utils/password';
import { UserRole, AuthProvider } from '@common/constants';
import { logger } from '@common/utils/logger';

/** The single, well-known support/admin account. */
export const ADMIN_EMAIL = 'support@wisora.org';

/**
 * Ensure a support@wisora.org admin exists. On first run it creates the account
 * with a freshly generated random password (printed ONCE to the console). If the
 * account already exists it is left untouched (just promoted to admin if needed).
 * The password can always be changed later via the "Forgot password" flow.
 */
export async function seedAdmin(): Promise<void> {
  const existing = await UserModel.findOne({ email: ADMIN_EMAIL }).exec();

  if (existing) {
    if (existing.role !== UserRole.ADMIN) {
      existing.role = UserRole.ADMIN;
      await existing.save();
      logger.info(`🔑 Promoted ${ADMIN_EMAIL} to admin.`);
    } else {
      logger.info(`🔑 Admin ${ADMIN_EMAIL} already exists — leaving it untouched.`);
    }
    return;
  }

  // Simple, readable, random one-time password, e.g. "Wisora@9f3a1c7d".
  const password = `Wisora@${randomBytes(4).toString('hex')}`;
  await UserModel.create({
    name: 'Wisora Admin',
    email: ADMIN_EMAIL,
    password: await hashPassword(password),
    provider: AuthProvider.LOCAL,
    role: UserRole.ADMIN,
  });

  logger.info('══════════════════════════════════════════════════');
  logger.info('  ✅ Admin account created');
  logger.info(`  Email:    ${ADMIN_EMAIL}`);
  logger.info(`  Password: ${password}`);
  logger.info('  Save this now — it is shown only once.');
  logger.info('  You can change it anytime via "Forgot password".');
  logger.info('══════════════════════════════════════════════════');
}
