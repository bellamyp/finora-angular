import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionPendingList } from './transaction-pending-list';
import { TransactionService } from '../../services/transaction.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

describe('TransactionPendingList', () => {
  let component: TransactionPendingList;
  let fixture: ComponentFixture<TransactionPendingList>;
  let mockTransactionService: any;
  let mockBankService: any;
  let mockBrandService: any;

  const mockTransactions = [
    {
      id: 'tx1',
      date: '2025-11-01',
      amount: -50,
      typeId: 'BILLS',
      notes: 'Electricity',
      bankId: 'bank1',
      brandId: 'brand1',
      posted: false,
      groupId: null
    },
    {
      id: 'tx2',
      date: '2025-11-02',
      amount: 120,
      typeId: 'INCOME',
      notes: 'Freelance',
      bankId: 'bank2',
      brandId: 'brand2',
      posted: false,
      groupId: null
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
    mockTransactionService = jasmine.createSpyObj('TransactionService', ['getPendingTransactions']);
    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, TransactionPendingList],
      providers: [
        provideHttpClientTesting(),
        { provide: TransactionService, useValue: mockTransactionService },
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

  it('should load pending transactions with bankName and brandName', () => {
    mockTransactionService.getPendingTransactions.and.returnValue(of(mockTransactions));
    mockBankService.getBanks.and.returnValue(of(mockBanks));
    mockBrandService.getBrandsByUser.and.returnValue(of(mockBrands));

    component.ngOnInit();

    expect(component.results.length).toBe(2);

    const tx1 = component.results[0];
    const tx2 = component.results[1];

    // Bank names
    expect(tx1.bankName).toBe('Bank A');
    expect(tx2.bankName).toBe('Bank B');

    // Brand names
    expect(tx1.brandName).toBe('Brand X (NY)');
    expect(tx2.brandName).toBe('Brand Y (CA)');

    expect(component.loading).toBeFalse();
  });

  it('should handle empty pending transactions', () => {
    mockTransactionService.getPendingTransactions.and.returnValue(of([]));
    mockBankService.getBanks.and.returnValue(of([]));
    mockBrandService.getBrandsByUser.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.results.length).toBe(0);
    expect(component.loading).toBeFalse();
  });

  it('should handle service errors gracefully', () => {
    spyOn(console, 'error');

    mockTransactionService.getPendingTransactions.and.returnValue(
      throwError(() => new Error('Service failed'))
    );
    mockBankService.getBanks.and.returnValue(of([]));
    mockBrandService.getBrandsByUser.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.results.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch pending transactions:',
      jasmine.any(Error)
    );
  });
});
