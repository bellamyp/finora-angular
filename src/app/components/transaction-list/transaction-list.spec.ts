import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionList } from './transaction-list';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { of, throwError } from 'rxjs';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TransactionList', () => {
  let component: TransactionList;
  let fixture: ComponentFixture<TransactionList>;
  let mockTransactionGroupService: any;

  const mockTransactionGroups: TransactionGroupDto[] = [
    {
      id: 'group1',
      transactions: [
        {
          id: 'tx1',
          date: '2025-10-09',
          amount: 250,
          typeId: 'SAVINGS',
          notes: 'Savings transfer',
          bankId: 'bank1',
          brandId: 'brand1'
        },
        {
          id: 'tx2',
          date: '2025-10-10',
          amount: 30,
          typeId: 'PET',
          notes: 'Pet supplies',
          bankId: 'bank1',
          brandId: 'brand1'
        }
      ]
    }
  ];

  beforeEach(async () => {
    mockTransactionGroupService = jasmine.createSpyObj('TransactionGroupService', ['getTransactionGroups']);

    await TestBed.configureTestingModule({
      imports: [TransactionList],
      providers: [
        provideHttpClientTesting(),
        { provide: TransactionGroupService, useValue: mockTransactionGroupService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posted transaction groups successfully', () => {
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of(mockTransactionGroups));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(1);
    expect(component.transactionGroups[0].id).toBe('group1');
    expect(component.transactionGroups[0].transactions.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle empty transaction groups', () => {
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
  });

  it('should handle service error gracefully', () => {
    spyOn(console, 'error');
    mockTransactionGroupService.getTransactionGroups.and.returnValue(throwError(() => new Error('Service failed')));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Failed to fetch posted transaction groups:', jasmine.any(Error));
  });
});
