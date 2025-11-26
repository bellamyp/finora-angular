import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionView } from './transaction-view';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { TransactionGroupRepeatService } from '../../services/transaction-group-repeat.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TransactionResponseDto, TransactionGroupDto } from '../../dto/transaction-group.dto';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';

describe('TransactionView', () => {
  let component: TransactionView;
  let fixture: ComponentFixture<TransactionView>;

  let mockTransactionGroupService: jasmine.SpyObj<TransactionGroupService>;
  let mockTransactionGroupRepeatService: jasmine.SpyObj<TransactionGroupRepeatService>;
  let mockBankService: jasmine.SpyObj<BankService>;
  let mockBrandService: jasmine.SpyObj<BrandService>;

  beforeEach(async () => {
    mockTransactionGroupService = jasmine.createSpyObj('TransactionGroupService', ['getTransactionGroupById']);
    mockTransactionGroupRepeatService = jasmine.createSpyObj('TransactionGroupRepeatService', ['isRepeat', 'markAsRepeat']);
    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);

    const mockActivatedRoute = {
      snapshot: { paramMap: { get: () => 'group123' } }
    };

    await TestBed.configureTestingModule({
      imports: [TransactionView],
      providers: [
        { provide: TransactionGroupService, useValue: mockTransactionGroupService },
        { provide: TransactionGroupRepeatService, useValue: mockTransactionGroupRepeatService },
        { provide: BankService, useValue: mockBankService },
        { provide: BrandService, useValue: mockBrandService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionView);
    component = fixture.componentInstance;

    // Mock data
    const mockTransactions: TransactionResponseDto[] = [
      { id: 'tx1', date: '2025-11-24', amount: 100, notes: 'Test', bankId: 'b1', brandId: 'br1', typeId: 'INCOME', posted: true, groupId: 'group123' }
    ];

    const mockGroup: TransactionGroupDto = { id: 'group123', transactions: mockTransactions };
    const mockBanks: BankDto[] = [{ id: 'b1', name: 'Bank1', type: 'CHECKING', email: 'user@example.com' }];
    const mockBrands: BrandDto[] = [{ id: 'br1', name: 'Brand1', location: 'NY' }];

    mockTransactionGroupService.getTransactionGroupById.and.returnValue(of(mockGroup));
    mockTransactionGroupRepeatService.isRepeat.and.returnValue(of(true));
    mockBankService.getBanks.and.returnValue(of(mockBanks));
    mockBrandService.getBrandsByUser.and.returnValue(of(mockBrands));

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions, banks, brands, and repeat status on init', () => {
    expect(component.transactions.length).toBe(1);
    expect(component.transactions[0].id).toBe('tx1');
    expect(component.banks.length).toBe(1);
    expect(component.brands.length).toBe(1);
    expect(component.groupId).toBe('group123');
    expect(component.isRepeat).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('should return correct bank name', () => {
    expect(component.getBankName('b1')).toBe('Bank1');
    expect(component.getBankName('unknown')).toBe('unknown');
  });

  it('should return correct brand name', () => {
    expect(component.getBrandName('br1')).toBe('Brand1 (NY)');
    expect(component.getBrandName('unknown')).toBe('unknown');
  });

  it('should mark group as repeat and reload transactions', fakeAsync(() => {
    const newTransactions: TransactionResponseDto[] = [
      {
        id: 'tx2',
        date: '2025-11-25',
        amount: 50,
        notes: 'Test2',
        bankId: 'b1',
        brandId: 'br1',
        typeId: 'BILLS',
        posted: false,
        groupId: 'group123'
      }
    ];

    // Dummy object to satisfy TransactionGroupDto type
    const dummyRepeatGroup: TransactionGroupDto = {
      id: 'group123',
      transactions: []
    };

    // Return dummy object instead of null
    mockTransactionGroupRepeatService.markAsRepeat.and.returnValue(of(dummyRepeatGroup));

    // Return actual new transactions for the reload
    mockTransactionGroupService.getTransactionGroupById.and.returnValue(of({
      id: 'group123',
      transactions: newTransactions
    }));

    component.markAsRepeat('group123');
    tick(); // process markAsRepeat
    tick(); // process getTransactionGroupById

    expect(component.transactions.length).toBe(1);
    expect(component.transactions[0].id).toBe('tx2');
    expect(component.isRepeat).toBeTrue();
    expect(component.loading).toBeFalse();
  }));

  it('should handle markAsRepeat error with 403', fakeAsync(() => {
    spyOn(window, 'alert');
    mockTransactionGroupRepeatService.markAsRepeat.and.returnValue(throwError(() => ({ status: 403 })));

    component.markAsRepeat('group123');
    tick();

    expect(window.alert).toHaveBeenCalledWith('You are not allowed to mark this group as repeat.');
    expect(component.loading).toBeFalse();
  }));

  it('should handle markAsRepeat error with other status', fakeAsync(() => {
    spyOn(window, 'alert');
    mockTransactionGroupRepeatService.markAsRepeat.and.returnValue(throwError(() => ({ status: 500 })));

    component.markAsRepeat('group123');
    tick();

    expect(window.alert).toHaveBeenCalledWith('Failed to mark group as repeat. Please try again.');
    expect(component.loading).toBeFalse();
  }));
});
