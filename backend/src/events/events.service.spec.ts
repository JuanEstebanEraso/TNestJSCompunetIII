import { EventsService } from './events.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  const mockEventRepo: any = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), remove: jest.fn() };
  const mockOptionRepo: any = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EventsService(mockEventRepo as any, mockOptionRepo as any);
  });

  it('create should save event and options and return event', async () => {
  mockEventRepo.create.mockReturnValue({});
    mockEventRepo.save.mockResolvedValue({ id: 'e1' });
    mockOptionRepo.create.mockReturnValue({});
    mockOptionRepo.save.mockResolvedValue([{}]);
    jest.spyOn(service, 'findOne' as any).mockResolvedValue({ id: 'e1' });

    const dto = { name: 'ev', description: 'd', options: [{ name: 'o', odds: 2 }] } as any;
    const res = await service.create(dto);
    expect(res.id).toBe('e1');
  });

  it('findOne should throw NotFound', async () => {
    mockEventRepo.findOne.mockResolvedValue(undefined);
    await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
  });

  it('update should throw if closed', async () => {
    jest.spyOn(service, 'findOne' as any).mockResolvedValue({ id: 'e1', status: 'closed' });
    await expect(service.update('e1', {} as any)).rejects.toThrow(BadRequestException);
  });

  it('closeEvent should validate option exists', async () => {
    jest.spyOn(service, 'findOne' as any).mockResolvedValue({ id: 'e1', status: 'open', options: [{ name: 'a' }] });
    await expect(service.closeEvent('e1', { finalResult: 'x' } as any)).rejects.toThrow(BadRequestException);
  });

  it('closeEvent should set closed state when valid', async () => {
    const evt: any = { id: 'e1', status: 'open', options: [{ name: 'a' }], finalResult: null };
    jest.spyOn(service, 'findOne' as any).mockResolvedValue(evt);
    mockEventRepo.save.mockResolvedValue({ ...evt, status: 'closed', finalResult: 'a' });

    const res = await service.closeEvent('e1', { finalResult: 'a' } as any);
    expect(res.status).toBe('closed');
    expect(res.finalResult).toBe('a');
  });

  it('getEventOption should return option when found', async () => {
    mockOptionRepo.findOne.mockResolvedValue({ id: 'o1', event: { id: 'e1' } });
    const res = await service.getEventOption('o1');
    expect(res.id).toBe('o1');
  });

  it('findAll should return events list', async () => {
    mockEventRepo.find.mockResolvedValue([{ id: 'e1' }]);
    const res = await service.findAll();
    expect(res).toEqual([{ id: 'e1' }]);
  });

  it('findAllOpen should return only open events', async () => {
    mockEventRepo.find.mockResolvedValue([{ id: 'e1', status: 'open' }]);
    const res = await service.findAllOpen();
    expect(res).toEqual([{ id: 'e1', status: 'open' }]);
  });

  it('findOne should return event when found', async () => {
    mockEventRepo.findOne.mockResolvedValue({ id: 'e1' });
    const res = await service.findOne('e1');
    expect(res.id).toBe('e1');
  });

  it('remove should call repository.remove', async () => {
    const event = { id: 'e1' };
    jest.spyOn(service, 'findOne' as any).mockResolvedValue(event as any);
    mockEventRepo.remove.mockResolvedValue(undefined);
    await service.remove('e1');
    expect(mockEventRepo.remove).toHaveBeenCalledWith(event);
  });

  it('getEventOption should throw if missing', async () => {
    mockOptionRepo.findOne.mockResolvedValue(undefined);
    await expect(service.getEventOption('o')).rejects.toThrow(NotFoundException);
  });

  it('validateOptionBelongsToEvent should return boolean', async () => {
    mockOptionRepo.findOne.mockResolvedValue(undefined);
    const f1 = await service.validateOptionBelongsToEvent('e', 'o');
    expect(f1).toBe(false);
    mockOptionRepo.findOne.mockResolvedValue({ id: 'o' });
    const f2 = await service.validateOptionBelongsToEvent('e', 'o');
    expect(f2).toBe(true);
  });
});
