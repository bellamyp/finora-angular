import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionGroupService, TransactionGroupResponse } from './transaction-group.service';
import { BackendConfig } from '../config/backend-config';
import { TransactionGroupDto } from '../dto/transaction-group.dto';

describe('TransactionGroupService', () => {
  let service: TransactionGroupService;
  let httpMock: HttpTestingController;

  const baseUrl = `${BackendConfig.springApiUrl}/transaction-groups`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionGroupService]
    });

    service = TestBed.inject(TransactionGroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request when creating a transaction group', () => {
    const payload: TransactionGroupDto = {
      transactions: [
        {
          id: 'tx1',
          date: '2025-11-23',
          amount: 100,
          bankId: 'bank1',
          brandId: 'b123',
          locationId: 'loc1',
          typeId: 'GROCERY',
          notes: 'Test',
          posted: false
        }
      ]
    };

    const mockResponse: TransactionGroupResponse = {
      success: true,
      groupId: 'abc123',
      message: 'Transaction group created successfully'
    };

    service.createTransactionGroup(payload).subscribe(res => {
      expect(res.success).toBeTrue();
      expect(res.groupId).toBe('abc123');
      expect(res.message).toBe('Transaction group created successfully');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should send PUT request when updating a transaction group', () => {
    const payload: TransactionGroupDto = {
      id: 'group123',
      transactions: [
        {
          id: 'tx1',
          date: '2025-11-23',
          amount: 150,
          bankId: 'bank1',
          brandId: 'b123',
          locationId: 'loc1',
          typeId: 'GROCERY',
          notes: 'Updated test',
          posted: true
        }
      ]
    };

    const mockResponse: TransactionGroupResponse = {
      success: true,
      groupId: 'group123',
      message: 'Transaction group updated successfully'
    };

    service.updateTransactionGroup(payload).subscribe(res => {
      expect(res.success).toBeTrue();
      expect(res.groupId).toBe('group123');
      expect(res.message).toBe('Transaction group updated successfully');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should fetch transaction groups with GET request', () => {
    const mockGroups: TransactionGroupDto[] = [
      {
        id: 'group1',
        transactions: [
          {
            id: 'tx1',
            date: '2025-11-23',
            amount: 200,
            bankId: 'bank1',
            brandId: 'b123',
            locationId: 'loc1',
            typeId: 'GROCERY',
            notes: 'Fetch test',
            posted: true
          }
        ]
      }
    ];

    service.getTransactionGroups('posted').subscribe(groups => {
      expect(groups.length).toBe(1);
      expect(groups[0].id).toBe('group1');
    });

    const req = httpMock.expectOne(`${baseUrl}?status=posted`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGroups);
  });

  it('should fetch a transaction group by ID with GET request', () => {
    const mockGroup: TransactionGroupDto = {
      id: 'group1',
      transactions: [
        {
          id: 'tx1',
          date: '2025-11-23',
          amount: 200,
          bankId: 'bank1',
          brandId: 'b123',
          locationId: 'loc1',
          typeId: 'GROCERY',
          notes: 'Fetch by ID test',
          posted: true
        }
      ]
    };

    service.getTransactionGroupById('group1').subscribe(group => {
      expect(group.id).toBe('group1');
      expect(group.transactions.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/group1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGroup);
  });
});
