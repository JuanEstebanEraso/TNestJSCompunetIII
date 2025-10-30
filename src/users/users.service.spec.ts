jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
}));
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepo: any = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(mockRepo as any);
  });

  describe('create', () => {
    it('should throw ConflictException if username exists', async () => {
      mockRepo.findOne.mockResolvedValue({ id: '1' });
      await expect(service.create({ username: 'u', password: 'p' } as any)).rejects.toThrow(ConflictException);
    });

    it('should create and save user', async () => {
      mockRepo.findOne.mockResolvedValue(undefined);
  (bcrypt as any).hash.mockResolvedValue('hashed');
      mockRepo.create.mockReturnValue({ username: 'u', password: 'hashed' });
      mockRepo.save.mockResolvedValue({ id: '1', username: 'u' });

      const res = await service.create({ username: 'u', password: 'p' } as any);
      expect(res.username).toBe('u');
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when not found', async () => {
      mockRepo.findOne.mockResolvedValue(undefined);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should return user when found', async () => {
      const user = { id: '1', username: 'u' };
      mockRepo.findOne.mockResolvedValue(user);
      const res = await service.findOne('1');
      expect(res).toBe(user);
    });
  });

  describe('updateBalance', () => {
    it('should throw on insufficient funds', async () => {
      mockRepo.findOne.mockResolvedValue({ id: '1', balance: 0 });
      await expect(service.updateBalance('1', -100)).rejects.toThrow(BadRequestException);
    });

    it('should update and save balance', async () => {
      const u = { id: '1', balance: 50 };
      mockRepo.findOne.mockResolvedValue(u);
      mockRepo.save.mockImplementation((x: any) => Promise.resolve(x));
      const res = await service.updateBalance('1', 25);
      expect(res.balance).toBe(75);
    });
  });

  describe('getUserBalance', () => {
    it('should return balance object with numeric value', async () => {
      mockRepo.findOne.mockResolvedValue({ id: '1', balance: '123' });
      const res = await service.getUserBalance('1');
      expect(res).toEqual({ balance: 123 });
      expect(res.balance).toBe(123);
    });
  });

  describe('findByUsername / update / remove', () => {
    it('findByUsername should throw when missing', async () => {
      mockRepo.findOne.mockResolvedValue(undefined);
      await expect(service.findByUsername('x')).rejects.toThrow();
    });

    it('update should throw on username conflict', async () => {
      const existing = { id: '2', username: 'taken' };
      jest.spyOn(service, 'findOne' as any).mockResolvedValue({ id: '1', username: 'old' } as any);
      mockRepo.findOne.mockResolvedValue(existing);
      await expect(service.update('1', { username: 'taken' } as any)).rejects.toThrow();
    });

    it('remove should call repository remove', async () => {
      const user = { id: '1' };
      jest.spyOn(service, 'findOne' as any).mockResolvedValue(user as any);
      mockRepo.remove = jest.fn().mockResolvedValue(undefined);
      await service.remove('1');
      expect(mockRepo.remove).toHaveBeenCalledWith(user);
    });
  });
});
