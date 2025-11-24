import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { BackendConfig } from '../config/backend-config';
import { TransactionSearchDto } from '../dto/transaction-search.dto';
import { TransactionResponseDto } from '../dto/transaction-group.dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService]
    });

    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make POST request on searchTransactions', () => {
    const payload: TransactionSearchDto = {
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      minAmount: 0,
      maxAmount: 1000,
      bankId: 'bank1',
      brandId: 'brand1',
      typeId: 'INCOME',
      keyword: 'test'
    };

    const mockResponse: TransactionResponseDto[] = [
      {
        id: 'tx1',
        groupId: 'group1',
        bankId: 'bank1',
        brandId: 'brand1',
        typeId: 'INCOME',
        date: '2025-11-24',
        amount: 100,
        notes: 'Test',
        posted: true
      }
    ];

    service.searchTransactions(payload).subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].id).toBe('tx1');
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/transactions/search`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse); // return mock response
  });

  it('should handle HTTP errors', () => {
    const payload: TransactionSearchDto = {};

    service.searchTransactions(payload).subscribe({
      next: () => fail('should have failed with error'),
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/transactions/search`);
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });
});
