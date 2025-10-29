import { TestBed } from '@angular/core/testing';
import {CanActivateFn, Router} from '@angular/router';

import { authGuard } from './auth-guard';
import {AuthService} from '../services/auth.service';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should allow activation when user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);

    const result = executeGuard(null as any, null as any);

    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should prevent activation and redirect to /login when user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);

    const result = executeGuard(null as any, null as any);

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
