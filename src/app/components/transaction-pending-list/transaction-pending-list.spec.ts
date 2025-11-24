import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionPendingList } from './transaction-pending-list';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { of, throwError } from 'rxjs';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

describe('TransactionPendingList', () => {
  let component: TransactionPendingList;
  let fixture: ComponentFixture<TransactionPendingList>;
  let mockTransactionGroupService: any;
  let mockBankService: any;
  let mockBrandService: any;

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
          brandId: 'brand1',
          posted: false
        },
        {
          id: 'tx2',
          date: '2025-11-02',
          amount: 120,
          typeId: 'INCOME',
          notes: 'Freelance',
          bankId: 'bank2',
          brandId: 'brand2',
          posted: false
        }
      ]
    }
  ];

  const mockBanks = [
    { id: 'bank1', name: 'Bank A' },
    { id: 'bank2', name: 'Bank B' }
  ];

  const mockBrands = [
    { id: 'brand1', name: 'Brand X', location: 'NY' },
    { id: 'brand2', name: 'Brand Y', location: 'CA' }
  ];

  beforeEach(async () => {
    mockTransactionGroupService = jasmine.createSpyObj('TransactionGroupService', ['getTransactionGroups']);
    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, TransactionPendingList],
      providers: [
        provideHttpClientTesting(),
        { provide: TransactionGroupService, useValue: mockTransactionGroupService },
        { provide: BankService, useValue: mockBankService },
        { provide: BrandService, useValue: mockBrandService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionPendingList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pending transaction groups with bankName and brandName', () => {
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of(mockPendingGroups));
    mockBankService.getBanks.and.returnValue(of(mockBanks));
    mockBrandService.getBrandsByUser.and.returnValue(of(mockBrands));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(1);
    const tx1 = component.transactionGroups[0].transactions[0];
    const tx2 = component.transactionGroups[0].transactions[1];

    // Check bank names
    expect(tx1.bankName).toBe('Bank A');
    expect(tx2.bankName).toBe('Bank B');

    // Check brand names with location
    expect(tx1.brandName).toBe('Brand X (NY)');
    expect(tx2.brandName).toBe('Brand Y (CA)');

    // Check posted flag
    expect(tx1.posted).toBeFalse();
    expect(tx2.posted).toBeFalse();

    expect(component.loading).toBeFalse();
  });

  it('should handle empty pending transaction groups', () => {
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of([]));
    mockBankService.getBanks.and.returnValue(of([]));
    mockBrandService.getBrandsByUser.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
  });

  it('should handle service errors gracefully', () => {
    spyOn(console, 'error');
    mockTransactionGroupService.getTransactionGroups.and.returnValue(throwError(() => new Error('Service failed')));
    mockBankService.getBanks.and.returnValue(of([]));
    mockBrandService.getBrandsByUser.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Failed to fetch pending transaction groups:', jasmine.any(Error));
  });
});
