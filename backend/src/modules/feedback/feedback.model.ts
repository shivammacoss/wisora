import { Schema, model, type Document, type Model, Types } from 'mongoose';

/** A piece of feedback submitted by a user, optionally answered by an admin. */
export interface FeedbackDocument extends Document {
  user: Types.ObjectId;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'replied';
  reply?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // Denormalised so the admin table renders without a join.
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['open', 'replied'], default: 'open', index: true },
    reply: { type: String },
    repliedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const FeedbackModel: Model<FeedbackDocument> = model<FeedbackDocument>(
  'Feedback',
  feedbackSchema,
);
