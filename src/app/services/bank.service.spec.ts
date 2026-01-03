import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BankService } from './bank.service';
import { BackendConfig } from '../config/backend-config';
import { BankDto } from '../dto/bank.dto';
import { BankCreateDto } from '../dto/bank-create.dto';

describe('BankService', () => {
  let service: BankService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BankService]
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

  // GET all banks
  it('should fetch all banks', () => {
    const mockResponse: BankDto[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        groupId: 'G1',
        name: 'Capital One Savings',
        type: 'SAVINGS',
        email: 'user@example.com',
        pendingBalance: 1500.75,
        postedBalance: 2000.25
      }
    ];

    service.getBanks().subscribe(banks => {
      expect(banks.length).toBe(1);
      const bank = banks[0];
      expect(bank.name).toBe('Capital One Savings');
      expect(bank.groupId).toBe('G1');
      expect(bank.pendingBalance).toBe(1500.75);
      expect(bank.postedBalance).toBe(2000.25);
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/banks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // GET bank by ID
  it('should fetch a single bank by ID', () => {
    const mockBank: BankDto = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      groupId: 'G2',
      name: 'Chase Checking',
      type: 'CHECKING',
      email: 'user@example.com',
      pendingBalance: 1200.50,
      postedBalance: 2500.00
    };

    service.getBankById(mockBank.id).subscribe(bank => {
      expect(bank).toEqual(mockBank);
      expect(bank.pendingBalance).toBe(1200.50);
      expect(bank.postedBalance).toBe(2500.00);
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/banks/${mockBank.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBank);
  });

  // POST create a bank
  it('should create a bank', () => {
    const formValue: BankCreateDto = {
      name: 'Test Bank',
      openingDate: '2025-11-02',
      closingDate: null,
      type: 'CHECKING',
      groupId: 'G100'
    };

    const mockResponse: BankDto = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      groupId: 'G100',
      name: formValue.name,
      type: formValue.type,
      email: 'user@example.com',
      pendingBalance: 0,
      postedBalance: 0
    };

    service.createBank(formValue).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.groupId).toBe('G100');
      expect(res.pendingBalance).toBe(0);
      expect(res.postedBalance).toBe(0);
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/banks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(formValue);
    req.flush(mockResponse);
  });
});
