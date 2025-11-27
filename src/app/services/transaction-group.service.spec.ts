import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionGroupService } from './transaction-group.service';
import { BackendConfig } from '../config/backend-config';

describe('TransactionGroupService', () => {
  let service: TransactionGroupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionGroupService]
    });

    service = TestBed.inject(TransactionGroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request when creating a transaction group', () => {
    const payload: TransactionGroupCreateDto = {
      date: '2025-11-23',
      brandId: 'b123',
      typeId: 'GROCERY',
      transactions: [
        { amount: 100, bankId: 'bank1', notes: 'Test' }
      ]
    };

    const mockResponse = {
      success: true,
      groupId: 'abc123',
      message: 'Transaction group created successfully'
    };

    service.createTransactionGroup(payload).subscribe(res => {
      expect(res.success).toBeTrue();
      expect(res.groupId).toBe('abc123');
      expect(res.message).toBe('Transaction group created successfully');
    });

    const req = httpMock.expectOne(`${BackendConfig.springApiUrl}/transaction-groups`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse);
  });
});
