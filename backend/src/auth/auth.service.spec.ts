jest.mock('bcrypt', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn(),
}));
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  const mockRepo: any = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('signed-token'),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(mockRepo as any, mockJwt as any);
  });

  describe('register', () => {
    it('should create a user and return token', async () => {
  (bcrypt as any).hashSync.mockReturnValue('hashed');

      const dto = { username: 'user1', password: 'pass' } as any;
      const created = { id: '1', username: 'user1', password: 'hashed', roles: ['user'] };
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const res = await service.register(dto);

      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
      expect(res.token).toBe('signed-token');
      expect(res.username).toBe('user1');
      expect(res.password).toBeUndefined();
    });

    it('should throw ConflictException on duplicate', async () => {
  (bcrypt as any).hashSync.mockReturnValue('hashed');
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockRejectedValue({ code: '23505' });

      await expect(service.register({ username: 'u', password: 'p' } as any)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
  (bcrypt as any).hashSync.mockReturnValue('hashed');
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockRejectedValue(new Error('boom'));

      await expect(service.register({ username: 'u', password: 'p' } as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(undefined);
      await expect(service.login({ username: 'x', password: 'p' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user inactive', async () => {
      mockRepo.findOne.mockResolvedValue({ isActive: false });
      await expect(service.login({ username: 'x', password: 'p' } as any)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on bad password', async () => {
      mockRepo.findOne.mockResolvedValue({ isActive: true, password: 'hashed' });
  (bcrypt as any).compareSync.mockReturnValue(false);
      await expect(service.login({ username: 'x', password: 'p' } as any)).rejects.toThrow(UnauthorizedException);
    });

    it('should return user and token on success', async () => {
      const user = { id: '1', username: 'u', password: 'hashed', roles: ['user'], isActive: true, balance: 100 };
      mockRepo.findOne.mockResolvedValue({ ...user });
  (bcrypt as any).compareSync.mockReturnValue(true);

      const res = await service.login({ username: 'u', password: 'p' } as any);

      expect(res.token).toBe('signed-token');
      expect(res.username).toBe('u');
      expect(res.password).toBeUndefined();
    });
  });
});
