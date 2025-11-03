import { TestBed } from '@angular/core/testing';
import { TransactionService } from './transaction-service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BackendConfig } from '../config/backend-config';
import { TransactionDto } from '../dto/transaction.dto';
import { TransactionTypeEnum } from '../dto/transaction-type.enum';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch transactions by email', () => {
    const mockTransactions: TransactionDto[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440002', // UUID instead of number
        date: '2025-10-09',
        amount: 250,
        type: TransactionTypeEnum.SAVINGS,
        notes: 'Test',
        bankName: 'Bank A',
        userEmail: 'test@example.com'
      }
    ];
    const testEmail = 'test@example.com';

    service.getTransactionsByEmail(testEmail).subscribe(transactions => {
      expect(transactions).toEqual(mockTransactions);
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/transactions?email=${testEmail}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactions);
  });
});
