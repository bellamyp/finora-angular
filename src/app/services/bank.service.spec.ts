import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BankService } from './bank.service';
import { BackendConfig } from '../config/backend-config';
import { BankDto } from '../dto/bank.dto';
import {BankCreateDto} from '../dto/bank-create.dto';

describe('BankService', () => {
  let service: BankService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BankService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(BankService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch banks by user email', () => {
    const mockEmail = 'user@example.com';
    const mockResponse: BankDto[] = [
      { id: 1, name: 'Capital One Savings', type: 'SAVINGS', email: mockEmail }
    ];

    service.getBanksByUserEmail(mockEmail).subscribe(banks => {
      expect(banks.length).toBe(1);
      expect(banks[0].name).toBe('Capital One Savings');
      expect(banks[0].type).toBe('SAVINGS');
      expect(banks[0].email).toBe(mockEmail);
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/banks?email=${mockEmail}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a bank', () => {
    const formValue: BankCreateDto = {
      name: 'Test Bank',
      openingDate: '2025-11-02',
      closingDate: null,
      type: 'CHECKING',
      userEmail: 'user@example.com'
    };

    const mockResponse: BankDto = {
      id: 123,
      name: formValue.name,
      type: formValue.type,
      email: formValue.userEmail
    };

    service.createBank(formValue).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/banks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(formValue);
    req.flush(mockResponse);
  });
});
