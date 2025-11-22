// src/app/services/user.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { UserDTO } from '../dto/user.dto';
import { BackendConfig } from '../config/backend-config';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: UserDTO[] = [
    { name: 'Alice', email: 'alice@example.com', role: 'ROLE_ADMIN' },
    { name: 'Bob', email: 'bob@example.com', role: 'ROLE_USER' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),         // <-- provide the real HttpClient (_HttpClient)
        provideHttpClientTesting()   // <-- provide the testing controller
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all users via GET', () => {
    service.getAllUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/users`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);
  });

  it('should handle error', () => {
    service.getAllUsers().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/users`);
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });
});
