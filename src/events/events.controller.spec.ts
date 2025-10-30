import { EventsController } from './events.controller';

describe('EventsController', () => {
  let controller: EventsController;
  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllOpen: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    closeEvent: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new EventsController(mockService as any);
  });

  it('create should delegate to service', () => {
    const dto = { name: 'e' };
    controller.create(dto as any);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('findAllOpen should delegate', () => {
    controller.findAllOpen();
    expect(mockService.findAllOpen).toHaveBeenCalled();
  });

  it('closeEvent should delegate', () => {
    controller.closeEvent('id', { finalResult: 'x' } as any);
    expect(mockService.closeEvent).toHaveBeenCalledWith('id', { finalResult: 'x' });
  });

  it('findOne should delegate to service.findOne', () => {
    controller.findOne('id');
    expect(mockService.findOne).toHaveBeenCalledWith('id');
  });

  it('update should delegate to service.update', () => {
    controller.update('id', { name: 'x' } as any);
    expect(mockService.update).toHaveBeenCalledWith('id', { name: 'x' });
  });

  it('remove should delegate to service.remove', () => {
    controller.remove('id');
    expect(mockService.remove).toHaveBeenCalledWith('id');
  });
});
