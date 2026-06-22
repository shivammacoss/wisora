import { UserModel, type UserDocument } from '@modules/auth/auth.model';
import type { UpdateProfileDto } from './users.dto';

/**
 * Data access for user profiles. Reuses the User aggregate owned by the auth
 * module. The ONLY layer here that talks to Mongoose.
 */
export interface IUserRepository {
  list(skip: number, limit: number): Promise<{ items: UserDocument[]; total: number }>;
  findById(id: string): Promise<UserDocument | null>;
  updateProfile(id: string, data: UpdateProfileDto): Promise<UserDocument | null>;
}

export class UserRepository implements IUserRepository {
  async list(skip: number, limit: number): Promise<{ items: UserDocument[]; total: number }> {
    const [items, total] = await Promise.all([
      UserModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      UserModel.countDocuments().exec(),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).exec();
  }

  updateProfile(id: string, data: UpdateProfileDto): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }
}
