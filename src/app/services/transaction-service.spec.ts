import { TestBed } from '@angular/core/testing';
import { TransactionService } from './transaction-service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BackendConfig } from '../config/backend-config';
import { TransactionDto } from '../dto/transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionService,
        provideHttpClient(),          // provides HttpClient
        provideHttpClientTesting()    // provides HttpTestingController
      ]
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

  it('should fetch transactions by email', () => {
    const mockTransactions: TransactionDto[] = [
      { id: 1, date: '2025-10-09', amount: 250, type: 'SAVINGS', notes: 'Test', bankName: 'Bank A', userEmail: 'test@example.com' }
    ];
    const testEmail = 'test@example.com';

    service.getTransactionsByEmail(testEmail).subscribe(transactions => {
      expect(transactions).toEqual(mockTransactions);
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/transactions?email=${testEmail}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactions); // respond with mock data
  });
});
