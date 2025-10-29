import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UserDTO} from '../dto/user.dto';
import {BackendConfig} from '../config/backend-config';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const mockUsers: UserDTO[] = [
    { id: 1, username: 'alice', email: 'alice@example.com' },
    { id: 2, username: 'bob', email: 'bob@example.com' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are pending
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

    // Expect one GET request to the correct URL
    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/users`);
    expect(req.request.method).toBe('GET');

    // Respond with mock data
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
