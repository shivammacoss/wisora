import { Schema, model, type Document, type Model } from 'mongoose';
import { PaymentProvider, PaymentStatus, Currency } from '@common/constants';

/** A persisted record of a chapter-unlock payment (for the admin history). */
export interface PaymentDocument extends Document {
  provider: PaymentProvider;
  currency: Currency;
  /** Amount in the gateway's smallest unit (paise / cents). */
  amount: number;
  chapterOrder: number;
  receipt: string;
  orderId?: string;
  paymentId?: string;
  status: PaymentStatus | 'created';
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    provider: { type: String, enum: Object.values(PaymentProvider), required: true },
    currency: { type: String, enum: Object.values(Currency), required: true },
    amount: { type: Number, required: true },
    chapterOrder: { type: Number, required: true },
    receipt: { type: String, required: true, index: true },
    orderId: { type: String, index: true, sparse: true },
    paymentId: { type: String },
    status: {
      type: String,
      enum: [...Object.values(PaymentStatus), 'created'],
      default: 'created',
      index: true,
    },
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

export const PaymentModel: Model<PaymentDocument> = model<PaymentDocument>('Payment', paymentSchema);
