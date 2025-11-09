import { BetsController } from './bets.controller';

describe('BetsController', () => {
  let controller: BetsController;
  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUser: jest.fn(),
    findByEvent: jest.fn(),
    processEventBets: jest.fn(),
    getUserStats: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new BetsController(mockService as any);
  });

  it('create should delegate to service.create', () => {
    const dto = { userId: 'u', eventId: 'e', selectedOption: 'o', amount: 10 };
    controller.create(dto as any);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('findByUser should delegate', () => {
    controller.findByUser('u');
    expect(mockService.findByUser).toHaveBeenCalledWith('u');
  });

  it('getUserStats should delegate', () => {
    controller.getUserStats('u');
    expect(mockService.getUserStats).toHaveBeenCalledWith('u');
  });
});
