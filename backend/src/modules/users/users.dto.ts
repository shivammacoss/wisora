import type { Currency, UserRole } from '@common/constants';

/** Public representation of a user (never exposes password / token hashes). */
export interface PublicUserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currency: Currency;
  createdAt: Date;
}

/** Fields a user may patch on their own profile. */
export interface UpdateProfileDto {
  name?: string;
  currency?: Currency;
}
