import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionRepeatList } from './transaction-repeat-list';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { TransactionGroupRepeatService } from '../../services/transaction-group-repeat.service';
import { of, throwError } from 'rxjs';
import { TransactionGroupDto, TransactionResponseDto } from '../../dto/transaction-group.dto';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';

describe('TransactionRepeatList', () => {
  let component: TransactionRepeatList;
  let fixture: ComponentFixture<TransactionRepeatList>;

  let mockTransactionGroupService: jasmine.SpyObj<TransactionGroupService>;
  let mockBankService: jasmine.SpyObj<BankService>;
  let mockBrandService: jasmine.SpyObj<BrandService>;
  let mockTransactionGroupRepeatService: jasmine.SpyObj<TransactionGroupRepeatService>;

  const mockBanks: BankDto[] = [
    { id: 'b1', name: 'Bank1', type: 'CHECKING', email: 'a@b.com' }
  ];

  const mockBrands: BrandDto[] = [
    { id: 'br1', name: 'Brand1', location: 'NY' }
  ];

  const mockTransactions: TransactionResponseDto[] = [
    { id: 'tx1', date: '2025-11-26', amount: 100, notes: 'Test', bankId: 'b1', brandId: 'br1', typeId: 'INCOME', posted: true, groupId: 'g1' }
  ];

  const mockGroups: TransactionGroupDto[] = [
    { id: 'g1', transactions: mockTransactions }
  ];

  beforeEach(async () => {
    mockTransactionGroupService = jasmine.createSpyObj('TransactionGroupService', ['getTransactionGroups']);
    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);
    mockTransactionGroupRepeatService = jasmine.createSpyObj('TransactionGroupRepeatService', ['removeRepeat']);

    await TestBed.configureTestingModule({
      imports: [TransactionRepeatList],
      providers: [
        { provide: TransactionGroupService, useValue: mockTransactionGroupService },
        { provide: BankService, useValue: mockBankService },
        { provide: BrandService, useValue: mockBrandService },
        { provide: TransactionGroupRepeatService, useValue: mockTransactionGroupRepeatService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionRepeatList);
    component = fixture.componentInstance;

    // Mock initial service responses
    mockBankService.getBanks.and.returnValue(of(mockBanks));
    mockBrandService.getBrandsByUser.and.returnValue(of(mockBrands));
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of(mockGroups));

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load repeat transaction groups with bankName and brandName', () => {
    expect(component.transactionGroups.length).toBe(1);
    const group = component.transactionGroups[0];
    expect(group.id).toBe('g1');
    expect(group.transactions[0].bankName).toBe('Bank1');
    expect(group.transactions[0].brandName).toBe('Brand1 (NY)');
    expect(component.loading).toBeFalse();
  });

  it('should handle empty transaction groups', fakeAsync(() => {
    mockTransactionGroupService.getTransactionGroups.and.returnValue(of([]));
    component.fetchRepeatTransactionGroups();
    tick();
    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
  }));

  it('should handle service error gracefully', fakeAsync(() => {
    spyOn(console, 'error');

    // Mock all forkJoin observables BEFORE fixture.detectChanges()
    mockBankService.getBanks.and.returnValue(of([]));
    mockBrandService.getBrandsByUser.and.returnValue(of([]));
    mockTransactionGroupService.getTransactionGroups.and.returnValue(
      throwError(() => new Error('Service failed'))
    );

    // Recreate component to trigger ngOnInit with mocks
    fixture = TestBed.createComponent(TransactionRepeatList);
    component = fixture.componentInstance;

    fixture.detectChanges(); // triggers ngOnInit
    tick(); // process forkJoin

    expect(component.transactionGroups.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Failed to fetch repeat transaction groups:', jasmine.any(Error));
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

  it('should handle remove repeat tag error', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(console, 'error');
    mockTransactionGroupRepeatService.removeRepeat.and.returnValue(throwError(() => ({ error: 'Forbidden' })));

    component.removeRepeatTag('g1');
    tick();

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to remove repeat tag: Forbidden');
    expect(component.loading).toBeFalse();
  }));

  it('should call repeatGroup and show alert', () => {
    spyOn(window, 'alert');
    component.repeatGroup('g1');
    expect(window.alert).toHaveBeenCalledWith('MOCK Repeat group clicked: g1');
  });
});
