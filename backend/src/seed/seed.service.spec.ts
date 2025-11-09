import { SeedService } from './seed.service';
import { seedData } from './data/seed-data';

describe('SeedService', () => {
  let service: SeedService;
  const userRepo: any = { findOne: jest.fn(), create: jest.fn(), save: jest.fn(), find: jest.fn(), query: jest.fn() };
  const eventRepo: any = { findOne: jest.fn(), create: jest.fn(), save: jest.fn(), find: jest.fn(), query: jest.fn() };
  const optionRepo: any = { findOne: jest.fn(), create: jest.fn(), save: jest.fn(), query: jest.fn() };
  const betRepo: any = { findOne: jest.fn(), create: jest.fn(), save: jest.fn(), find: jest.fn(), query: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SeedService(userRepo as any, eventRepo as any, optionRepo as any, betRepo as any);
  });

  it('seedAll should call sub-seeds and return message', async () => {
    jest.spyOn(service, 'seedUsers' as any).mockResolvedValue(undefined);
    jest.spyOn(service, 'seedEvents' as any).mockResolvedValue(undefined);
    jest.spyOn(service, 'seedBets' as any).mockResolvedValue(undefined);
    const res = await service.seedAll();
    expect(res.message).toContain('Seed completado');
  });

  it('seedBets should return early when no users or events', async () => {
    userRepo.find.mockResolvedValue([]);
    eventRepo.find.mockResolvedValue([]);
    await service.seedBets();
    expect(betRepo.save).not.toHaveBeenCalled();
  });

  it('seedUsers should skip when user exists', async () => {
    userRepo.findOne.mockResolvedValue({ id: '1', username: 'u' });
    const spy = jest.spyOn(userRepo, 'save');
    await service.seedUsers();
    expect(spy).not.toHaveBeenCalled();
  });

  it('seedEvents should skip when event exists', async () => {
    eventRepo.findOne.mockResolvedValue({ id: 'e1', name: 'ev' });
    const spy = jest.spyOn(eventRepo, 'save');
    await service.seedEvents();
    expect(spy).not.toHaveBeenCalled();
  });

  it('seedUsers should create users when missing', async () => {
    // force all users to be missing
    userRepo.findOne.mockResolvedValue(undefined);
    userRepo.create.mockImplementation((u: any) => u);
    userRepo.save.mockResolvedValue(undefined);
    await service.seedUsers();
    expect(userRepo.save).toHaveBeenCalled();
  });

  it('seedEvents should create events and options when missing', async () => {
    eventRepo.findOne.mockResolvedValue(undefined);
    eventRepo.create.mockImplementation((e: any) => e);
    eventRepo.save.mockResolvedValue({ id: 'e1', name: 'ev' });
    optionRepo.create.mockImplementation((o: any) => o);
    optionRepo.save.mockResolvedValue([{}]);
    // run
    await service.seedEvents();
    expect(eventRepo.save).toHaveBeenCalled();
    expect(optionRepo.save).toHaveBeenCalled();
  });

  it('seedBets should create bets when users and events exist', async () => {
    // use seedData to ensure matching usernames and event names
    userRepo.find.mockResolvedValue(seedData.users as any);
    eventRepo.find.mockResolvedValue(seedData.events as any);
    betRepo.create.mockImplementation((b: any) => b);
    betRepo.save.mockResolvedValue({});
    await service.seedBets();
    expect(betRepo.save).toHaveBeenCalled();
  });

  it('clearAll should call queries and return message', async () => {
    betRepo.query.mockResolvedValue(undefined);
    optionRepo.query.mockResolvedValue(undefined);
    eventRepo.query.mockResolvedValue(undefined);
    userRepo.query.mockResolvedValue(undefined);
    const res = await service.clearAll();
    expect(res.message).toContain('Todos los datos limpiados');
  });
});
