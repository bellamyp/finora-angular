import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionList } from './transaction-list';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { LocationService } from '../../services/location.service';
import { of, throwError } from 'rxjs';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TransactionList', () => {
  let component: TransactionList;
  let fixture: ComponentFixture<TransactionList>;
  let mockTransactionGroupService: any;
  let mockBankService: any;
  let mockBrandService: any;
  let mockLocationService: any;

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
          brandId: 'brand1',
          locationId: 'loc1',
          posted: false
        },
        {
          id: 'tx2',
          date: '2025-10-10',
          amount: 30,
          typeId: 'PET',
          notes: 'Pet supplies',
          bankId: 'bank1',
          brandId: 'brand1',
          locationId: 'loc1',
          posted: false
        }
      ]
    }
  ];

  const mockBanks = [
    { id: 'bank1', name: 'Bank A' }
  ];

  const mockBrands = [
    { id: 'brand1', name: 'Brand X' }
  ];

  const mockLocations = [
    { id: 'loc1', city: 'New York', state: 'NY' }
  ];

  beforeEach(async () => {
    mockTransactionGroupService = jasmine.createSpyObj('TransactionGroupService', ['getTransactionGroups']);
    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);
    mockLocationService = jasmine.createSpyObj('LocationService', ['getLocations']);

    await TestBed.configureTestingModule({
      imports: [TransactionList],
      providers: [
        provideHttpClientTesting(),
        { provide: TransactionGroupService, useValue: mockTransactionGroupService },
        { provide: BankService, useValue: mockBankService },
        { provide: BrandService, useValue: mockBrandService },
        { provide: LocationService, useValue: mockLocationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posted transaction groups with bankName, brandName, and locationName', () => {
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of(mockTransactionGroups));
    mockBankService.getBanks.and.returnValue(of(mockBanks));
    mockBrandService.getBrandsByUser.and.returnValue(of(mockBrands));
    mockLocationService.getLocations.and.returnValue(of(mockLocations));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(1);

    const tx1 = component.transactionGroups[0].transactions[0];
    expect(tx1.bankName).toBe('Bank A');
    expect(tx1.brandName).toBe('Brand X');
    expect(tx1.locationName).toBe('New York, NY');
    expect(component.loading).toBeFalse();
  });

  it('should handle empty transaction groups', () => {
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of([]));
    mockBankService.getBanks.and.returnValue(of([]));
    mockBrandService.getBrandsByUser.and.returnValue(of([]));
    mockLocationService.getLocations.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
  });

  it('should handle service error gracefully', () => {
    spyOn(console, 'error');
    mockTransactionGroupService.getTransactionGroups.and.returnValue(throwError(() => new Error('Service failed')));
    mockBankService.getBanks.and.returnValue(of([]));
    mockBrandService.getBrandsByUser.and.returnValue(of([]));
    mockLocationService.getLocations.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Failed to fetch posted transaction groups:', jasmine.any(Error));
  });
});
