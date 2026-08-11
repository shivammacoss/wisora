import { NotFoundError } from '@common/errors';
import type { PaginatedResult } from '@common/interfaces';
import { UserModel } from '@modules/auth/auth.model';
import { emailService } from '@integrations/email/email.service';
import { logger } from '@common/utils/logger';
import { FeedbackModel, type FeedbackDocument } from './feedback.model';
import type { CreateFeedbackDto } from './feedback.validation';

export interface PublicFeedback {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'replied';
  reply?: string;
  repliedAt?: Date;
  createdAt: Date;
}

/** Feedback business logic: user submissions + admin replies. */
export class FeedbackService {
  /** A signed-in user submits feedback. Author name/email are captured. */
  async create(userId: string, dto: CreateFeedbackDto): Promise<PublicFeedback> {
    const author = await UserModel.findById(userId).exec();
    if (!author) throw new NotFoundError('User not found');

    const doc = await FeedbackModel.create({
      user: author._id,
      userName: author.name,
      userEmail: author.email,
      subject: dto.subject,
      message: dto.message,
    });
    return toPublic(doc);
  }

  /** Admin: every piece of feedback, newest first. */
  async listAll(page: number, limit: number): Promise<PaginatedResult<PublicFeedback>> {
    const [items, total] = await Promise.all([
      FeedbackModel.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).exec(),
      FeedbackModel.countDocuments().exec(),
    ]);
    return { items: items.map(toPublic), total, page, limit };
  }

  /** A user's own feedback threads (with admin replies). */
  async listMine(userId: string): Promise<PublicFeedback[]> {
    const items = await FeedbackModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
    return items.map(toPublic);
  }

  /** Admin: answer a piece of feedback (and email the reply to the reader). */
  async reply(id: string, reply: string): Promise<PublicFeedback> {
    const doc = await FeedbackModel.findByIdAndUpdate(
      id,
      { reply, status: 'replied', repliedAt: new Date() },
      { new: true },
    ).exec();
    if (!doc) throw new NotFoundError('Feedback not found');

    // Email the reply to the reader who submitted it (best-effort — a mail
    // failure must never fail the admin's reply).
    void notifyReplyByEmail(doc.userEmail, doc.userName, doc.subject, doc.message, reply);

    return toPublic(doc);
  }
}

/** Send the admin's reply to the reader's email. Never throws. */
async function notifyReplyByEmail(
  to: string,
  name: string,
  subject: string,
  message: string,
  reply: string,
): Promise<void> {
  try {
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:auto;color:#1A1A1A">
        <h2 style="font-family:Georgia,serif;color:#1A1A1A">Wisora replied to your feedback</h2>
        <p style="color:#4B5563;line-height:1.6">Hi ${name || 'there'}, thanks for reaching out. Here's our reply:</p>
        <div style="border-left:3px solid #D4A017;background:#FBF6EC;padding:14px 18px;border-radius:8px;margin:18px 0">
          <p style="margin:0;color:#1A1A1A;line-height:1.6;white-space:pre-wrap">${escapeHtml(reply)}</p>
        </div>
        <p style="color:#9CA3AF;font-size:13px;margin-top:24px">Your message was:</p>
        <p style="color:#6B7280;font-size:13px;line-height:1.5;white-space:pre-wrap">
          <strong>${escapeHtml(subject)}</strong><br/>${escapeHtml(message)}
        </p>
        <p style="color:#9CA3AF;font-size:12px;margin-top:24px">— The Wisora team</p>
      </div>`;
    await emailService.send(to, `Re: ${subject} — Wisora`, html);
    logger.info(`[feedback] reply emailed to ${to}`);
  } catch (err) {
    logger.warn(`[feedback] reply email not sent to ${to}: ${(err as Error).message}`);
  }
}

/** Minimal HTML escaping for user-supplied strings placed in the email body. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toPublic(doc: FeedbackDocument): PublicFeedback {
  return {
    id: doc.id,
    userName: doc.userName,
    userEmail: doc.userEmail,
    subject: doc.subject,
    message: doc.message,
    status: doc.status,
    reply: doc.reply,
    repliedAt: doc.repliedAt,
    createdAt: doc.createdAt,
  };
}
