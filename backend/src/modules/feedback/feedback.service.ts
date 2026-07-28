import { NotFoundError } from '@common/errors';
import type { PaginatedResult } from '@common/interfaces';
import { UserModel } from '@modules/auth/auth.model';
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

  /** Admin: answer a piece of feedback. */
  async reply(id: string, reply: string): Promise<PublicFeedback> {
    const doc = await FeedbackModel.findByIdAndUpdate(
      id,
      { reply, status: 'replied', repliedAt: new Date() },
      { new: true },
    ).exec();
    if (!doc) throw new NotFoundError('Feedback not found');
    return toPublic(doc);
  }
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
