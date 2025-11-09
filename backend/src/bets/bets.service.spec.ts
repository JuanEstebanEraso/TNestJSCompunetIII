import { BetsService } from './bets.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BetsService', () => {
  let service: BetsService;
  const mockRepo: any = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUsers = {
    findOne: jest.fn(),
    updateBalance: jest.fn(),
  } as any;

  const mockEvents = {
    findOne: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BetsService(mockRepo as any, mockUsers, mockEvents);
  });

  describe('create', () => {
    it('should throw if insufficient balance', async () => {
      mockUsers.findOne.mockResolvedValue({ balance: 10 });
      await expect(
        service.create({ userId: 'u', eventId: 'e', selectedOption: 'o', amount: 20 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if event not open', async () => {
      mockUsers.findOne.mockResolvedValue({ balance: 100 });
      mockEvents.findOne.mockResolvedValue({ status: 'closed' });
      await expect(
        service.create({ userId: 'u', eventId: 'e', selectedOption: 'o', amount: 20 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create bet when all good', async () => {
      mockUsers.findOne.mockResolvedValue({ balance: 100 });
      mockEvents.findOne.mockResolvedValue({ status: 'open', options: [{ name: 'o', odds: 2 }] });
      mockRepo.create.mockReturnValue({});
      mockRepo.save.mockResolvedValue({ id: 'b1' });

      const res = await service.create({ userId: 'u', eventId: 'e', selectedOption: 'o', amount: 20 } as any);
      expect(mockUsers.updateBalance).toHaveBeenCalledWith('u', -20);
      expect(mockRepo.save).toHaveBeenCalled();
      expect(res.id).toBe('b1');
    });
  });

  describe('findOne', () => {
    it('should throw NotFound if missing', async () => {
      mockRepo.findOne.mockResolvedValue(undefined);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('processEventBets', () => {
    it('should throw if event not closed or no result', async () => {
      mockEvents.findOne.mockResolvedValue({ status: 'open' });
      await expect(service.processEventBets('e')).rejects.toThrow(BadRequestException);
      mockEvents.findOne.mockResolvedValue({ status: 'closed', finalResult: null });
      await expect(service.processEventBets('e')).rejects.toThrow(BadRequestException);
    });

    it('should process bets and update balances', async () => {
      mockEvents.findOne.mockResolvedValue({ status: 'closed', finalResult: 'win' });
      mockRepo.find.mockResolvedValue([
        { id: 'b1', selectedOption: 'win', amount: 10, odds: 2, userId: 'u' , status: 'pending'},
        { id: 'b2', selectedOption: 'lose', amount: 5, odds: 3, userId: 'u', status: 'pending' },
      ]);
      mockRepo.save.mockResolvedValue(null);

      await service.processEventBets('e');

      expect(mockUsers.updateBalance).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should throw if not pending', async () => {
      jest.spyOn(service, 'findOne' as any).mockResolvedValue({ status: 'won', userId: 'u', amount: 10 });
      await expect(service.remove('b1')).rejects.toThrow(BadRequestException);
    });

    it('should remove pending bet and refund', async () => {
      jest.spyOn(service, 'findOne' as any).mockResolvedValue({ status: 'pending', userId: 'u', amount: 10 });
      mockRepo.remove.mockResolvedValue(null);
      await service.remove('b1');
      expect(mockUsers.updateBalance).toHaveBeenCalledWith('u', 10);
      expect(mockRepo.remove).toHaveBeenCalled();
    });
  });

  describe('getUserStats', () => {
    it('should compute stats correctly', async () => {
      const bets = [
        { status: 'pending', amount: 10, profit: 0 },
        { status: 'won', amount: 5, profit: 15 },
        { status: 'lost', amount: 8, profit: 0 },
      ];
      jest.spyOn(service, 'findByUser' as any).mockResolvedValue(bets as any);
      const stats = await service.getUserStats('u');
      expect(stats.totalBets).toBe(3);
      expect(stats.pendingBets).toBe(1);
      expect(stats.wonBets).toBe(1);
      expect(stats.lostBets).toBe(1);
      expect(stats.totalAmountBet).toBe(23);
      expect(stats.totalProfit).toBe(15);
      expect(stats.totalLoss).toBe(8);
    });
  });
});
