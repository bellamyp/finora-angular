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
      {
        id: 'tx1',
        date: '2025-11-24',
        amount: 100,
        notes: 'Test',
        bankId: 'b1',
        brandId: 'br1',
        typeId: 'INCOME',
        posted: true,
        groupId: 'group123',
        locationId: 'loc1'
      }
    ];

    const mockGroup: TransactionGroupDto = { id: 'group123', transactions: mockTransactions };

    // Updated BankDto with pendingBalance & postedBalance
    const mockBanks: BankDto[] = [{
      id: 'b1',
      groupId: 'G1',
      name: 'Bank1',
      type: '',
      email: '',
      pendingBalance: 100,
      postedBalance: 200
    }];

    const mockBrands: BrandDto[] = [{ id: 'br1', name: 'Brand1' }];

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
    expect(component.banks[0].groupId).toBe('G1'); // verify groupId
    expect(component.banks[0].pendingBalance).toBe(100);
    expect(component.banks[0].postedBalance).toBe(200);
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
    expect(component.getBrandName('br1')).toBe('Brand1');
    expect(component.getBrandName('unknown')).toBe('unknown');
  });

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
