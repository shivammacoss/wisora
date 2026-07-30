import { randomBytes } from 'crypto';
import { UserModel } from '@modules/auth/auth.model';
import { hashPassword } from '@common/utils/password';
import { UserRole, AuthProvider } from '@common/constants';
import { env } from '@config/env';
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
  // A fixed password from env takes priority; otherwise generate a random one.
  const fixed = env.ADMIN_PASSWORD;

  if (existing) {
    let changed = false;
    if (existing.role !== UserRole.ADMIN) {
      existing.role = UserRole.ADMIN;
      changed = true;
    }
    if (fixed) {
      // Reset the existing admin to the fixed password.
      existing.password = await hashPassword(fixed);
      changed = true;
    }
    if (changed) {
      await existing.save();
      logger.info(
        fixed
          ? `🔑 Admin ${ADMIN_EMAIL} updated — password set from ADMIN_PASSWORD.`
          : `🔑 Promoted ${ADMIN_EMAIL} to admin.`,
      );
    } else {
      logger.info(`🔑 Admin ${ADMIN_EMAIL} already exists — leaving it untouched.`);
    }
    return;
  }

  // New admin: use the fixed password if provided, else a random one-time one.
  const password = fixed ?? `Wisora@${randomBytes(4).toString('hex')}`;
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
  if (fixed) {
    logger.info('  Password: (from ADMIN_PASSWORD in .env)');
  } else {
    logger.info(`  Password: ${password}`);
    logger.info('  Save this now — it is shown only once.');
  }
  logger.info('══════════════════════════════════════════════════');
}
