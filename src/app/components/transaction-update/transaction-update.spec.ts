import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TransactionUpdate } from './transaction-update';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { TransactionTypeEnum } from '../../dto/transaction-type.enum';
import { TransactionGroupDto, TransactionResponseDto } from '../../dto/transaction-group.dto';
import {BankDto} from '../../dto/bank.dto';
import {BrandDto} from '../../dto/brand.dto';

// Dummy data
const mockGroup: TransactionGroupDto = {
  id: 'group1',
  transactions: [
    {
      id: 'tx1',
      date: '2025-11-23',
      amount: 100,
      notes: 'Test transaction',
      bankId: 'bank1',
      brandId: 'brand1',
      typeId: TransactionTypeEnum.GROCERY,
      posted: false
    }
  ]
};

const mockBanks: BankDto[] = [
  { id: 'bank1', name: 'Chase', type: 'checking', email: 'test@bank.com' }
];

const mockBrands: BrandDto[] = [
  { id: 'brand1', name: 'Nike', location: 'Houston'}
];

describe('TransactionUpdate', () => {
  let component: TransactionUpdate;
  let fixture: ComponentFixture<TransactionUpdate>;

  const mockTransactionGroupService = {
    getTransactionGroupById: jasmine.createSpy('getTransactionGroupById').and.returnValue(of(mockGroup)),
    updateTransactionGroup: jasmine.createSpy('updateTransactionGroup').and.returnValue(of({ success: true }))
  };

  const mockBankService = {
    getBanks: jasmine.createSpy('getBanks').and.returnValue(of(mockBanks))
  };

  const mockBrandService = {
    getBrandsByUser: jasmine.createSpy('getBrandsByUser').and.returnValue(of(mockBrands))
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    events: of(),
    createUrlTree: jasmine.createSpy('createUrlTree').and.callFake(() => ({})),
    serializeUrl: jasmine.createSpy('serializeUrl').and.callFake(url => url)
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('group1')
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionUpdate],
      providers: [
        { provide: TransactionGroupService, useValue: mockTransactionGroupService },
        { provide: BankService, useValue: mockBankService },
        { provide: BrandService, useValue: mockBrandService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockTransactionGroupService.getTransactionGroupById.calls.reset();
    mockTransactionGroupService.updateTransactionGroup.calls.reset();
    mockBankService.getBanks.calls.reset();
    mockBrandService.getBrandsByUser.calls.reset();
    mockRouter.navigate.calls.reset();
    mockActivatedRoute.snapshot.paramMap.get.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transaction group, banks, brands, and types on init', () => {
    expect(component.transactions.length).toBe(1);
    expect(component.banks).toEqual(mockBanks);
    expect(component.brands).toEqual(mockBrands);
    expect(component.transactionTypes.length).toBeGreaterThan(0);
    expect(component.loading).toBeFalse();
  });

  it('should add and delete transactions', () => {
    const initialLength = component.transactions.length;

    component.addTransaction();
    expect(component.transactions.length).toBe(initialLength + 1);

    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteTransaction(component.transactions[0], 0);
    expect(component.transactions.length).toBe(initialLength);
  });

  it('should mark transaction as posted if valid', () => {
    const tx = component.transactions[0];
    spyOn(window, 'alert');

    component.markAsPosted(tx);
    expect(tx.posted).toBeTrue();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should not mark transaction as posted if invalid', () => {
    const tx: TransactionResponseDto = {
      id: '',
      date: '',
      amount: 0,
      notes: '',
      bankId: '',
      brandId: '',
      typeId: '',
      posted: false
    };
    spyOn(window, 'alert');

    component.markAsPosted(tx);
    expect(tx.posted).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith(
      'Please fill in all required fields (date, type, brand, amount, bank) before marking as posted.'
    );
  });

  it('should submit all transactions successfully', () => {
    spyOn(window, 'alert');

    component.submitAll();
    expect(mockTransactionGroupService.updateTransactionGroup).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-pending-list']);
    expect(window.alert).toHaveBeenCalledWith('Transaction group updated successfully!');
  });

  it('should handle submitAll error', () => {
    spyOn(window, 'alert');
    mockTransactionGroupService.updateTransactionGroup.and.returnValue(throwError(() => new Error('Failed')));
    component.submitAll();

    expect(window.alert).toHaveBeenCalledWith('An error occurred while submitting the transaction group.');
  });

  it('should go back and cancel properly', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'reloadPage');

    component.cancel();
    expect(component.reloadPage).toHaveBeenCalled();

    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-pending-list']);
  });
});
