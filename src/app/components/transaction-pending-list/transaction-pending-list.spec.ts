import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionPendingList } from './transaction-pending-list';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { of, throwError } from 'rxjs';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TransactionPendingList', () => {
  let component: TransactionPendingList;
  let fixture: ComponentFixture<TransactionPendingList>;
  let mockTransactionGroupService: any;

  const mockPendingGroups: TransactionGroupDto[] = [
    {
      id: 'pending1',
      transactions: [
        {
          id: 'tx1',
          date: '2025-11-01',
          amount: -50,
          typeId: 'BILLS',
          notes: 'Electricity',
          bankId: 'bank1',
          brandId: 'brand1'
        },
        {
          id: 'tx2',
          date: '2025-11-02',
          amount: 120,
          typeId: 'INCOME',
          notes: 'Freelance',
          bankId: 'bank2',
          brandId: 'brand2'
        }
      ]
    }
  ];

  beforeEach(async () => {
    mockTransactionGroupService = jasmine.createSpyObj('TransactionGroupService', ['getTransactionGroups']);

    await TestBed.configureTestingModule({
      imports: [TransactionPendingList],
      providers: [
        provideHttpClientTesting(),
        { provide: TransactionGroupService, useValue: mockTransactionGroupService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionPendingList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pending transaction groups successfully', () => {
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of(mockPendingGroups));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(1);
    expect(component.transactionGroups[0].id).toBe('pending1');
    expect(component.transactionGroups[0].transactions.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle empty pending transaction groups', () => {
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
  });

  it('should handle service errors gracefully', () => {
    spyOn(console, 'error');
    mockTransactionGroupService.getTransactionGroups.and.returnValue(
      throwError(() => new Error('Service failed'))
    );

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Failed to fetch pending transaction groups:', jasmine.any(Error));
  });
});
