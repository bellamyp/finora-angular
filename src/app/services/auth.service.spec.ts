import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize loggedIn as false when no user in localStorage', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should initialize loggedIn as true when user exists in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test' }));

    // Manually create a fresh instance
    const freshService = new AuthService();

    expect(freshService.isLoggedIn()).toBeTrue();
  });

  it('should login successfully with correct credentials', () => {
    const result = service.login('test', 'test');

    expect(result).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();
    expect(localStorage.getItem('user')).toBe(JSON.stringify({ email: 'test' }));
  });

  it('should fail login with incorrect credentials', () => {
    const result = service.login('wrong', 'wrong');

    expect(result).toBeFalse();
    expect(service.isLoggedIn()).toBeFalse();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should logout correctly', () => {
    // First login
    service.login('test', 'test');
    expect(service.isLoggedIn()).toBeTrue();

    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
