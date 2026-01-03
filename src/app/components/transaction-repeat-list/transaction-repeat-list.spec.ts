import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionRepeatList } from './transaction-repeat-list';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { LocationService } from '../../services/location.service';
import { TransactionGroupRepeatService } from '../../services/transaction-group-repeat.service';
import { of, throwError } from 'rxjs';
import { TransactionGroupDto, TransactionResponseDto } from '../../dto/transaction-group.dto';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';
import { LocationDto } from '../../dto/location.dto';
import { Router } from '@angular/router';

describe('TransactionRepeatList', () => {
  let component: TransactionRepeatList;
  let fixture: ComponentFixture<TransactionRepeatList>;

  let mockTransactionGroupService: jasmine.SpyObj<TransactionGroupService>;
  let mockBankService: jasmine.SpyObj<BankService>;
  let mockBrandService: jasmine.SpyObj<BrandService>;
  let mockLocationService: jasmine.SpyObj<LocationService>;
  let mockTransactionGroupRepeatService: jasmine.SpyObj<TransactionGroupRepeatService>;
  let mockRouter: jasmine.SpyObj<Router>;

  // Updated BankDto with pendingBalance & postedBalance
  const mockBanks: BankDto[] = [
    {
      id: 'b1',
      groupId: 'G1',
      name: 'Bank1',
      type: 'CHECKING',
      email: 'a@b.com',
      pendingBalance: 1000,
      postedBalance: 900
    }
  ];
  const mockBrands: BrandDto[] = [{ id: 'br1', name: 'Brand1' }];
  const mockLocations: LocationDto[] = [{ id: 'loc1', city: 'New York', state: 'NY' }];
  const mockTransactions: TransactionResponseDto[] = [
    { id: 'tx1', date: '2025-11-26', amount: 100, notes: 'Test', bankId: 'b1', brandId: 'br1', locationId: 'loc1', typeId: 'INCOME', posted: true, groupId: 'g1' }
  ];
  const mockGroups: TransactionGroupDto[] = [{ id: 'g1', transactions: mockTransactions }];

  beforeEach(async () => {
    mockTransactionGroupService = jasmine.createSpyObj('TransactionGroupService', ['getTransactionGroups']);
    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);
    mockLocationService = jasmine.createSpyObj('LocationService', ['getLocations']);
    mockTransactionGroupRepeatService = jasmine.createSpyObj('TransactionGroupRepeatService', ['removeRepeat']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TransactionRepeatList],
      providers: [
        { provide: TransactionGroupService, useValue: mockTransactionGroupService },
        { provide: BankService, useValue: mockBankService },
        { provide: BrandService, useValue: mockBrandService },
        { provide: LocationService, useValue: mockLocationService },
        { provide: TransactionGroupRepeatService, useValue: mockTransactionGroupRepeatService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionRepeatList);
    component = fixture.componentInstance;

    // Default mock returns
    mockBankService.getBanks.and.returnValue(of(mockBanks));
    mockBrandService.getBrandsByUser.and.returnValue(of(mockBrands));
    mockLocationService.getLocations.and.returnValue(of(mockLocations));
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of(mockGroups));

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load repeat transaction groups with mapped bankName, brandName, locationName, and balances', () => {
    expect(component.transactionGroups.length).toBe(1);
    const tx = component.transactionGroups[0].transactions[0];
    expect(tx.bankName).toBe('Bank1');
    expect(tx.brandName).toBe('Brand1');
    expect(tx.locationName).toBe('New York, NY');
    expect(component.loading).toBeFalse();
  });

  it('should handle empty transaction groups', fakeAsync(() => {
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of([]));
    component.fetchRepeatTransactionGroups();
    tick();
    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
  }));

  it('should handle service errors gracefully', fakeAsync(() => {
    spyOn(console, 'error');

    component.transactionGroups = [];
    component.loading = true;

    mockTransactionGroupService.getTransactionGroups.and.returnValue(
      throwError(() => new Error('Service failed'))
    );

    component.fetchRepeatTransactionGroups();
    tick();

    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch repeat transaction groups:',
      jasmine.any(Error)
    );
  }));

  it('should remove repeat tag and reload groups', fakeAsync(() => {
    mockTransactionGroupRepeatService.removeRepeat.and.returnValue(of('Success'));
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of(mockGroups));

    component.removeRepeatTag('g1');
    tick(); // process removeRepeat
    tick(); // process fetchRepeatTransactionGroups
    expect(component.transactionGroups.length).toBe(1);
    expect(component.loading).toBeFalse();
  }));

  it('should handle remove repeat tag errors', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(console, 'error');
    mockTransactionGroupRepeatService.removeRepeat.and.returnValue(throwError(() => ({ error: 'Forbidden' })));

    component.removeRepeatTag('g1');
    tick();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to remove repeat tag: Forbidden');
    expect(component.loading).toBeFalse();
  }));

  it('should navigate to repeat group', () => {
    component.repeatGroup('g1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-update', 'g1', 'repeat']);
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
