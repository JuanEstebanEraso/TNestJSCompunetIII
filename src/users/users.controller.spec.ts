import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUsername: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getUserBalance: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new UsersController(mockService as any);
  });

  it('create should call service.create', () => {
    const dto = { username: 'u', password: 'p' };
    controller.create(dto as any);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('getUserBalance should call service.getUserBalance', () => {
    controller.getUserBalance('id-1');
    expect(mockService.getUserBalance).toHaveBeenCalledWith('id-1');
  });

  it('findAll should call service.findAll', () => {
    controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('findOne should call service.findOne', () => {
    controller.findOne('id-1');
    expect(mockService.findOne).toHaveBeenCalledWith('id-1');
  });

  it('findByUsername should call service.findByUsername', () => {
    controller.findByUsername('name');
    expect(mockService.findByUsername).toHaveBeenCalledWith('name');
  });

  it('update should call service.update', () => {
    controller.update('id-1', { username: 'x' } as any);
    expect(mockService.update).toHaveBeenCalledWith('id-1', { username: 'x' });
  });

  it('remove should call service.remove', () => {
    controller.remove('id-1');
    expect(mockService.remove).toHaveBeenCalledWith('id-1');
  });
});
