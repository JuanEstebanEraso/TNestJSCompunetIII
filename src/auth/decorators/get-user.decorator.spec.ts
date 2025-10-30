import { GetUser } from './get-user.decorator';

describe('GetUser decorator', () => {
  it('should return full user when no data passed', () => {
    const ctx: any = {
      switchToHttp: () => ({ getRequest: () => ({ user: { id: '1', name: 'u' } }) }),
    };

    const maybeFn = (GetUser as any)(undefined, ctx as any);
    const result = typeof maybeFn === 'function' ? maybeFn(undefined, ctx as any) : maybeFn;
    expect(result).toEqual({ id: '1', name: 'u' });
  });

  it('should return property when data passed', () => {
    const ctx: any = {
      switchToHttp: () => ({ getRequest: () => ({ user: { id: '1', name: 'u' } }) }),
    };

  const maybeFn = (GetUser as any)('name', ctx as any);
  const result = typeof maybeFn === 'function' ? maybeFn('name', ctx as any) : maybeFn;
  expect(result).toBe('u');
  });

  it('should throw when no user present', () => {
    const ctx: any = { switchToHttp: () => ({ getRequest: () => ({}) }) };
    const maybeFn = (GetUser as any)(undefined, ctx as any);
    // if it's a function, calling it should throw; otherwise it should throw directly
    if (typeof maybeFn === 'function') {
      expect(() => maybeFn(undefined, ctx as any)).toThrow();
    } else {
      expect(() => maybeFn).toThrow();
    }
  });
});
