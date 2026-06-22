import { Schema, model, type Document, type Model } from 'mongoose';
import { UserRole, Currency, AuthProvider } from '@common/constants';

/** Persistence shape of a user. Schema definition ONLY — no business logic. */
export interface UserDocument extends Document {
  name: string;
  email: string;
  /** Optional: absent for users who signed up via a federated provider (Google). */
  password?: string;
  provider: AuthProvider;
  googleId?: string;
  role: UserRole;
  currency: Currency;
  refreshTokenHash?: string;
  passwordResetTokenHash?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    // Not required at the schema level — Google users have no password. The
    // service guarantees local sign-ups always set one.
    password: { type: String, select: false },
    provider: { type: String, enum: Object.values(AuthProvider), default: AuthProvider.LOCAL },
    googleId: { type: String, index: true, sparse: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    currency: { type: String, enum: Object.values(Currency), default: Currency.INR },
    refreshTokenHash: { type: String, select: false },
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.refreshTokenHash;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const UserModel: Model<UserDocument> = model<UserDocument>('User', userSchema);
