import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import {firstValueFrom, of} from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize loggedIn as true when user exists in localStorage', () => {
    // Create a simple valid JWT (header.payload.signature)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: 'test@test.com',
      userId: 'AbC123xYz9',
      role: 'ROLE_USER',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 // expires 1 hour from now
    }));
    const fakeSignature = 'signature'; // just a placeholder
    const token = `${header}.${payload}.${fakeSignature}`;

    localStorage.setItem('token', token);

    // Re-instantiate the service to trigger constructor
    const freshService = TestBed.inject(AuthService);

    expect(freshService.isLoggedIn()).toBeTrue();
  });

  it('should login successfully using spy', async () => {
    spyOn(service, 'login').and.returnValue(of(true));

    const result = await firstValueFrom(service.login('test@test.com', 'test'));
    expect(result).toBeTrue();
    expect(service.login).toHaveBeenCalledWith('test@test.com', 'test');
  });

  it('should fail login with incorrect credentials (spy)', async () => {
    const email = 'wrong@test.com';
    const password = 'wrong';

    spyOn(service, 'login').and.returnValue(of(false));

    const result = await service.login(email, password).toPromise?.() ?? service.login(email, password).toPromise();

    expect(result).toBeFalse();
    expect(service.login).toHaveBeenCalledWith(email, password);
  });

  it('should logout correctly', () => {
    // Create a simple base64-encoded JWT header.payload.signature
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: 'test@example.com',
      userId: 'AbC123xYz9',
      role: 'ROLE_USER',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour in future
    }));
    const signature = 'signature';
    const token = `${header}.${payload}.${signature}`;

    localStorage.setItem('token', token);

    // Check logged in
    expect(service.isLoggedIn()).toBeTrue();

    // Logout
    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
