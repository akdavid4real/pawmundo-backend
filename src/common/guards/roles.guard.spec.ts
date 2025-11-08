import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  const mockExecutionContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
    } as any;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    const context = mockExecutionContext({ role: 'user' });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access if user has required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['vet']);

    const context = mockExecutionContext({ role: 'vet' });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should allow access if user has one of multiple required roles', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['vet', 'admin']);

    const context = mockExecutionContext({ role: 'vet' });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access if user does not have required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['vet']);

    const context = mockExecutionContext({ role: 'user' });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should deny access if user is not authenticated', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['vet']);

    const context = mockExecutionContext(null);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should deny access if user has no role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['vet']);

    const context = mockExecutionContext({ email: 'test@example.com' });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
