import { SeedController } from './seed.controller';

describe('SeedController', () => {
  let controller: SeedController;
  const mockService: any = {
    seedAll: jest.fn().mockResolvedValue({ message: 'ok' }),
    clearAll: jest.fn().mockResolvedValue({ message: 'cleared' }),
  };

  beforeEach(() => {
    controller = new SeedController(mockService as any);
  });

  it('executeSeed should call service.seedAll', async () => {
    const res = await controller.executeSeed();
    expect(mockService.seedAll).toHaveBeenCalled();
    expect(res).toEqual({ message: 'ok' });
  });

  it('clearDatabase should call service.clearAll', async () => {
    const res = await controller.clearDatabase();
    expect(mockService.clearAll).toHaveBeenCalled();
    expect(res).toEqual({ message: 'cleared' });
  });
});
