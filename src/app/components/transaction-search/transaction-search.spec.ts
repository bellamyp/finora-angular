import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionSearch } from './transaction-search';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { LocationService } from '../../services/location.service';
import { TransactionService } from '../../services/transaction.service';

describe('TransactionSearch', () => {
  let component: TransactionSearch;
  let fixture: ComponentFixture<TransactionSearch>;

  let mockBankService: any;
  let mockBrandService: any;
  let mockLocationService: any;
  let mockTransactionService: any;
  let mockRouter: any;

  beforeEach(async () => {

    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBankService.getBanks.and.returnValue(of([
      { id: 'bank1', name: 'Bank 1' }
    ]));

    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);
    mockBrandService.getBrandsByUser.and.returnValue(of([
      { id: 'brand1', name: 'Brand 1' }
    ]));

    mockLocationService = jasmine.createSpyObj('LocationService', ['getLocations']);
    mockLocationService.getLocations.and.returnValue(of([
      { id: 'loc1', city: 'Dallas', state: 'TX' }
    ]));

    mockTransactionService = jasmine.createSpyObj('TransactionService', ['searchTransactions']);
    mockTransactionService.searchTransactions.and.returnValue(of([
      {
        id: 'tx1',
        groupId: 'group1',
        bankId: 'bank1',
        brandId: 'brand1',
        locationId: 'loc1',
        typeId: 'INCOME',
        amount: 100,
        notes: 'Test'
      }
    ]));

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TransactionSearch],
      providers: [
        FormBuilder,
        { provide: BankService, useValue: mockBankService },
        { provide: BrandService, useValue: mockBrandService },
        { provide: LocationService, useValue: mockLocationService },
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSearch);
    component = fixture.componentInstance;

    fixture.detectChanges();  // triggers ngOnInit
  });

  // ------------------------
  // BASIC CREATION
  // ------------------------
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ------------------------
  // INIT DATA LOADING
  // ------------------------
  it('should load banks, brands, and locations on init', fakeAsync(() => {
    tick();
    expect(component.banks.length).toBe(1);
    expect(component.brands.length).toBe(1);
    expect(component.locations.length).toBe(1);
    expect(component.locationMap['loc1']).toBe('Dallas, TX');
  }));

  // ------------------------
  // SEARCH SUCCESS
  // ------------------------
  it('should perform search and map results correctly', fakeAsync(() => {
    // Make sure transactionTypes are populated
    component.transactionTypes = [{ id: 'INCOME', name: 'Income' }];

    component.onSearch();
    tick();

    expect(component.results.length).toBe(1);

    const r = component.results[0];

    expect(r.bankName).toBe('Bank 1');
    expect(r.brandName).toBe('Brand 1');
    expect(r.locationName).toBe('Dallas, TX');
    expect(r.typeName).toBe('Income'); // now matches Title Case
    expect(component.loading).toBe(false);
  }));

  // ------------------------
  // SEARCH ERROR
  // ------------------------
  it('should handle search errors', fakeAsync(() => {
    mockTransactionService.searchTransactions.and.returnValue(
      throwError(() => new Error('Fail'))
    );

    component.onSearch();
    tick();

    expect(component.results.length).toBe(0);
    expect(component.loading).toBe(false);
  }));

  // ------------------------
  // NAVIGATION
  // ------------------------
  it('should navigate to transaction group', () => {
    component.openTransactionGroup('group1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-view', 'group1']);
  });

  // ------------------------
  // RESET
  // ------------------------
  it('should reset search form and state', () => {
    component.results = [{} as any];
    component.searched = true;
    component.loading = true;

    component.onReset();

    expect(component.results.length).toBe(0);
    expect(component.searched).toBeFalse();
    expect(component.loading).toBeFalse();
  });
});
