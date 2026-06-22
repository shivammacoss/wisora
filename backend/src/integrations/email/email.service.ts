import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '@config/env';
import { logger } from '@common/utils/logger';

/**
 * Infrastructure adapter for transactional email (Nodemailer/SMTP).
 * Isolated behind this interface so the domain never depends on the provider.
 */
export interface IEmailService {
  send(to: string, subject: string, html: string): Promise<void>;
  sendPasswordReset(to: string, resetUrl: string): Promise<void>;
}

export class EmailService implements IEmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
    logger.info('Email sent', { to, subject });
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;color:#1A1A1A">
        <h2 style="font-family:Georgia,serif;color:#1A1A1A">Reset your Wisora password</h2>
        <p style="color:#4B5563;line-height:1.6">
          We received a request to reset your password. Click the button below to choose a new one.
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        <p style="margin:28px 0">
          <a href="${resetUrl}"
             style="background:#D4A017;color:#fff;text-decoration:none;padding:12px 22px;border-radius:12px;font-weight:600">
            Reset password
          </a>
        </p>
        <p style="color:#9CA3AF;font-size:12px;word-break:break-all">Or paste this link: ${resetUrl}</p>
      </div>`;
    await this.send(to, 'Reset your Wisora password', html);
  }
}

export const emailService = new EmailService();
