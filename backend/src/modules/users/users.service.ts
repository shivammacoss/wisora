import { NotFoundError } from '@common/errors';
import type { PaginatedResult } from '@common/interfaces';
import type { UserDocument } from '@modules/auth/auth.model';
import type { IUserRepository } from './users.repository';
import type { PublicUserDto, UpdateProfileDto } from './users.dto';

/** Profile + admin user operations. Framework-agnostic business logic. */
export class UserService {
  constructor(private readonly repo: IUserRepository) {}

  async list(page: number, limit: number): Promise<PaginatedResult<PublicUserDto>> {
    const { items, total } = await this.repo.list((page - 1) * limit, limit);
    return { items: items.map(toPublicUser), total, page, limit };
  }

  async getProfile(id: string): Promise<PublicUserDto> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return toPublicUser(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<PublicUserDto> {
    const user = await this.repo.updateProfile(id, dto);
    if (!user) throw new NotFoundError('User not found');
    return toPublicUser(user);
  }
}

/** Map a persisted user to its safe public shape. */
function toPublicUser(user: UserDocument): PublicUserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    currency: user.currency,
    createdAt: user.createdAt,
  };
}
