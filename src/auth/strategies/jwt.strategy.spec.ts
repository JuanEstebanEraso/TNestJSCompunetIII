import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  const mockRepo: any = { findOne: jest.fn() };
  const mockConfig: any = { get: jest.fn().mockReturnValue('secret') };

  beforeEach(() => {
    jest.clearAllMocks();
    strategy = new JwtStrategy(mockRepo as any, mockConfig as any);
  });

  it('should throw when user not found', async () => {
    mockRepo.findOne.mockResolvedValue(undefined);
    await expect(strategy.validate({ id: 'x' } as any)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw when user inactive', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 'u', isActive: false, password: 'p' });
    await expect(strategy.validate({ id: 'u' } as any)).rejects.toThrow(UnauthorizedException);
  });

  it('should return user without password when active', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 'u', isActive: true, password: 'secret', username: 'u' });
    const res = await strategy.validate({ id: 'u' } as any);
    expect(res.password).toBeUndefined();
    expect(res.username).toBe('u');
  });
});
