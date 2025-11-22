import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  // Helper to execute the guard in TestBed context
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

    // Spy on alert
    spyOn(window, 'alert');
  });

  it('should allow activation when user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);

    const result = executeGuard(null as any, null as any);

    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should prevent activation and redirect to /login when user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);

    // Provide a fake state with a url
    const fakeState: RouterStateSnapshot = { url: '/protected' } as any;

    const result = executeGuard(null as any, fakeState);

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/protected' } });
    expect(window.alert).toHaveBeenCalledWith('⚠️ Your session has expired. Please log in again.');
  });
});
