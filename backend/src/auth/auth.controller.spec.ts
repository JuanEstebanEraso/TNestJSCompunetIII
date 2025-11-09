import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  const mockService: any = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(mockService as any);
  });

  it('register should call authService.register', async () => {
    const dto = { username: 'u', password: 'p' };
    await controller.register(dto as any);
    expect(mockService.register).toHaveBeenCalledWith(dto);
  });

  it('login should call authService.login', async () => {
    const dto = { username: 'u', password: 'p' };
    await controller.login(dto as any);
    expect(mockService.login).toHaveBeenCalledWith(dto);
  });

  it('getProfile should return user from request', async () => {
    const req = { user: { id: '1', username: 'u' } } as any;
    const res = await controller.getProfile(req);
    const returnedUser = (res && res.user && res.user.user) ? res.user.user : res.user;
    expect(returnedUser).toEqual(req.user);
  });
});
