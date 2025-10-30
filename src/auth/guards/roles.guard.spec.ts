import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  const reflector: any = { get: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new RolesGuard(reflector as any);
  });

  const mockContext = (user?: any, handlerRoles?: string[]) => {
    return {
      getHandler: () => ({}),
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    } as any;
  };

  it('should allow when no roles metadata', () => {
    reflector.get.mockReturnValue(undefined);
    const ok = guard.canActivate(mockContext());
    expect(ok).toBe(true);
  });

  it('should throw BadRequest if no user', () => {
    reflector.get.mockReturnValue(['admin']);
    expect(() => guard.canActivate(mockContext(undefined))).toThrow(BadRequestException);
  });

  it('should allow when user has role', () => {
    reflector.get.mockReturnValue(['admin']);
    const ok = guard.canActivate(mockContext({ username: 'u', roles: ['admin'] }));
    expect(ok).toBe(true);
  });

  it('should throw Forbidden when user lacks role', () => {
    reflector.get.mockReturnValue(['admin']);
    expect(() => guard.canActivate(mockContext({ username: 'u', roles: ['user'] }))).toThrow(ForbiddenException);
  });
});
