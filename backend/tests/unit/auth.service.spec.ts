import { AuthService } from '@modules/auth';
import type { IAuthRepository } from '@modules/auth';
import { ConflictError } from '@common/errors';

/**
 * Example unit test showing why the layering pays off: the service depends on
 * the repository INTERFACE, so we inject a mock — no DB, no Express, fast.
 */
describe('AuthService.register', () => {
  const baseRepo: IAuthRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    setRefreshTokenHash: jest.fn(),
  };

  it('throws ConflictError when the email already exists', async () => {
    const repo: IAuthRepository = {
      ...baseRepo,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      findByEmail: jest.fn().mockResolvedValue({ id: '1' } as any),
    };
    const service = new AuthService(repo);

    await expect(
      service.register({ name: 'A', email: 'a@b.com', password: 'password123' }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
