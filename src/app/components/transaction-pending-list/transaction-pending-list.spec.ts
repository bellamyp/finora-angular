import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionPendingList } from './transaction-pending-list';
import { TransactionService } from '../../services/transaction.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { LocationService } from '../../services/location.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BankDto } from '../../dto/bank.dto';

describe('TransactionPendingList', () => {
  let component: TransactionPendingList;
  let fixture: ComponentFixture<TransactionPendingList>;

  let mockTransactionService: jasmine.SpyObj<TransactionService>;
  let mockBankService: jasmine.SpyObj<BankService>;
  let mockBrandService: jasmine.SpyObj<BrandService>;
  let mockLocationService: jasmine.SpyObj<LocationService>;
  let mockRouter: jasmine.SpyObj<Router>;

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
      groupId: undefined,
      locationId: 'loc1'
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
      groupId: undefined,
      locationId: 'loc2'
    }
  ];

  const mockBanks: BankDto[] = [
    { id: 'bank1', groupId: 'G1', name: 'Bank A', type: 'CHECKING', email: 'a@bank.com', pendingBalance: 500 },
    { id: 'bank2', groupId: 'G2', name: 'Bank B', type: 'SAVINGS', email: 'b@bank.com', pendingBalance: 1200 }
  ];

  const mockBrands = [
    { id: 'brand1', name: 'Brand X' },
    { id: 'brand2', name: 'Brand Y' }
  ];

  const mockLocations = [
    { id: 'loc1', city: 'New York', state: 'NY' },
    { id: 'loc2', city: 'Los Angeles', state: 'CA' }
  ];

  beforeEach(async () => {
    mockTransactionService = jasmine.createSpyObj('TransactionService', ['getPendingTransactions']);
    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);
    mockLocationService = jasmine.createSpyObj('LocationService', ['getLocations']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, TransactionPendingList],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: BankService, useValue: mockBankService },
        { provide: BrandService, useValue: mockBrandService },
        { provide: LocationService, useValue: mockLocationService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionPendingList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pending transactions with mapped bankName, brandName, and locationName', fakeAsync(() => {
    mockTransactionService.getPendingTransactions.and.returnValue(of(mockTransactions));
    mockBankService.getBanks.and.returnValue(of(mockBanks));
    mockBrandService.getBrandsByUser.and.returnValue(of(mockBrands));
    mockLocationService.getLocations.and.returnValue(of(mockLocations));

    component.ngOnInit();
    tick();

    expect(component.results.length).toBe(2);

    const tx1 = component.results[0];
    const tx2 = component.results[1];

    // Bank names
    expect(tx1.bankName).toBe('Bank A');
    expect(tx2.bankName).toBe('Bank B');

    // Brand names
    expect(tx1.brandName).toBe('Brand X');
    expect(tx2.brandName).toBe('Brand Y');

    // Location names
    expect(tx1.locationName).toBe('New York, NY');
    expect(tx2.locationName).toBe('Los Angeles, CA');

    expect(component.loading).toBeFalse();
  }));

  it('should handle empty pending transactions', fakeAsync(() => {
    mockTransactionService.getPendingTransactions.and.returnValue(of([]));
    mockBankService.getBanks.and.returnValue(of([]));
    mockBrandService.getBrandsByUser.and.returnValue(of([]));
    mockLocationService.getLocations.and.returnValue(of([]));

    component.ngOnInit();
    tick();

    expect(component.results.length).toBe(0);
    expect(component.loading).toBeFalse();
  }));

  it('should handle service errors gracefully', fakeAsync(() => {
    spyOn(console, 'error');
    mockTransactionService.getPendingTransactions.and.returnValue(
      throwError(() => new Error('Service failed'))
    );
    mockBankService.getBanks.and.returnValue(of([]));
    mockBrandService.getBrandsByUser.and.returnValue(of([]));
    mockLocationService.getLocations.and.returnValue(of([]));

    component.ngOnInit();
    tick();

    expect(component.results.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Failed to fetch pending transactions:', jasmine.any(Error));
  }));

  it('should navigate to transaction group when groupId is provided', () => {
    component.openTransactionGroup('group123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-update', 'group123']);
  });

  it('getAmountDisplay should return correct class and format', () => {
    const positive = component.getAmountDisplay({ amount: 100 });
    expect(positive.display).toBe('$100.00');
    expect(positive.classes['text-success']).toBeTrue();

    const negative = component.getAmountDisplay({ amount: -50 });
    expect(negative.display).toBe('$-50.00');
    expect(negative.classes['text-danger']).toBeTrue();

    const nullAmount = component.getAmountDisplay({ amount: null });
    expect(nullAmount.display).toBe('—');
  });
});
