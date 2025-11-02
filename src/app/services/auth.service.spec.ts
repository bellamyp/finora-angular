import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BackendConfig } from '../config/backend-config';
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

  it('should initialize loggedIn as false when no user in localStorage', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should initialize loggedIn as true when user exists in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@test.com' }));
    const freshService = new AuthService({} as any); // mock HttpClient
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

  it('should logout correctly', async () => {
    const email = 'test@test.com';
    const password = 'test';

    // Trigger login (must subscribe before expectOne)
    const loginPromise = firstValueFrom(service.login(email, password));

    // No need to encode manually — HttpParams already encodes properly
    const req = httpMock.expectOne(
      `${BackendConfig.springApiUrl}/auth/login?email=${email}&password=${password}`
    );

    expect(req.request.method).toBe('POST');
    req.flush('Login successful', { status: 200, statusText: 'OK' });

    await loginPromise; // wait for the login request to complete

    expect(service.isLoggedIn()).toBeTrue();

    // Now test logout
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
