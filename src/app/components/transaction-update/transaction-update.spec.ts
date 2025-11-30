import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TransactionUpdate } from './transaction-update';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';
import { TransactionGroupDto, TransactionResponseDto } from '../../dto/transaction-group.dto';
import { TransactionTypeEnum } from '../../dto/transaction-type.enum';
import { LocationService } from '../../services/location.service';

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
      locationId: 'loc1',
      typeId: TransactionTypeEnum.GROCERY,
      posted: false
    }
  ]
};

const mockBanks: BankDto[] = [
  { id: 'bank1', groupId: 'G1', name: 'Chase', type: 'checking', email: 'test@bank.com', balance: 500 }
];

const mockBrands: BrandDto[] = [
  { id: 'brand1', name: 'Nike' }
];

describe('TransactionUpdate', () => {
  let component: TransactionUpdate;
  let fixture: ComponentFixture<TransactionUpdate>;

  const mockTransactionGroupService = {
    getTransactionGroupById: jasmine.createSpy('getTransactionGroupById').and.returnValue(of(mockGroup)),
    updateTransactionGroup: jasmine.createSpy('updateTransactionGroup').and.returnValue(of({ success: true, groupId: 'group1', message: 'ok' })),
    createTransactionGroup: jasmine.createSpy('createTransactionGroup').and.returnValue(of({ success: true, groupId: 'group1', message: 'ok' }))
  };

  const mockBankService = {
    getBanks: jasmine.createSpy('getBanks').and.returnValue(of(mockBanks))
  };

  const mockBrandService = {
    getBrandsByUser: jasmine.createSpy('getBrandsByUser').and.returnValue(of(mockBrands))
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  const mockLocationService = {
    getLocations: jasmine.createSpy('getLocations').and.returnValue(of([
      { id: 'loc1', city: 'Houston', state: 'TX' }
    ]))
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('group1')
      },
      url: []
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
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LocationService, useValue: mockLocationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockTransactionGroupService.getTransactionGroupById.calls.reset();
    mockTransactionGroupService.updateTransactionGroup.calls.reset();
    mockTransactionGroupService.createTransactionGroup.calls.reset();
    mockBankService.getBanks.calls.reset();
    mockBrandService.getBrandsByUser.calls.reset();
    mockRouter.navigate.calls.reset();
    mockActivatedRoute.snapshot.paramMap.get.calls.reset();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load transaction group, banks, brands, and types on init', () => {
    expect(component.transactions.length).toBe(1);
    expect(component.banks).toEqual(mockBanks);
    expect(component.banks[0].groupId).toBe('G1'); // verify groupId
    expect(component.brands).toEqual(mockBrands);
    expect(component.transactionTypes.length).toBeGreaterThan(0);
    expect(component.loading).toBeFalse();
  });

  it('should add a new transaction', () => {
    const initialLength = component.transactions.length;
    component.addTransaction();
    expect(component.transactions.length).toBe(initialLength + 1);
  });

  it('should delete a transaction when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const initialLength = component.transactions.length;
    component.deleteTransaction(component.transactions[0], 0);
    expect(component.transactions.length).toBe(initialLength - 1);
  });

  it('should not delete a transaction when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const initialLength = component.transactions.length;
    component.deleteTransaction(component.transactions[0], 0);
    expect(component.transactions.length).toBe(initialLength);
  });

  it('should mark a valid transaction as posted', () => {
    const tx = component.transactions[0];
    spyOn(window, 'alert');
    component.markAsPosted(tx);
    expect(tx.posted).toBeTrue();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should alert when marking an invalid transaction as posted', () => {
    const tx: TransactionResponseDto = {
      id: '',
      date: '',
      amount: null,
      notes: '',
      bankId: '',
      brandId: '',
      locationId: '',
      typeId: '',
      posted: false
    };

    spyOn(window, 'alert');

    component.markAsPosted(tx);

    expect(tx.posted).toBeFalse();

    const expectedMessage =
      "Please fill in the following fields:\n" +
      "- Date\n" +
      "- Type\n" +
      "- Brand\n" +
      "- Location\n" +
      "- Amount\n" +
      "- Bank";

    expect(window.alert).toHaveBeenCalledWith(expectedMessage);
  });

  it('should submitAll in update mode and navigate', fakeAsync(() => {
    spyOn(window, 'alert');

    component.mode = 'update';
    component.transactions = [
      {
        id: 'tx1',
        date: '2025-11-23',
        amount: 100,
        bankId: 'bank1',
        brandId: 'brand1',
        locationId: 'loc1',
        typeId: 'GROCERY',
        posted: false,
        notes: 'Test'
      }
    ];

    mockTransactionGroupService.updateTransactionGroup.and.returnValue(
      of({ success: true, groupId: 'group1', message: 'ok' })
    );

    component.submitAll();
    tick();

    expect(mockTransactionGroupService.updateTransactionGroup).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-view', 'group1']);
  }));

  it('should submitAll in create mode with valid transaction and navigate', fakeAsync(() => {
    spyOn(window, 'alert');
    component.mode = 'create';
    component.transactions[0].bankId = 'bank1';
    component.groupId = 'group1';
    component.submitAll();
    tick();
    expect(mockTransactionGroupService.createTransactionGroup).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-view', 'group1']);
  }));

  it('should alert if submitAll in create mode has no transactions', () => {
    spyOn(window, 'alert');
    component.mode = 'create';
    component.transactions = [];
    component.submitAll();
    expect(window.alert).toHaveBeenCalledWith('Add at least one transaction.');
  });

  it('should alert if submitAll in create mode has a transaction without bank', () => {
    spyOn(window, 'alert');
    component.mode = 'create';
    component.transactions[0].bankId = '';
    component.submitAll();
    expect(window.alert).toHaveBeenCalledWith('All transactions must have a bank selected.');
  });

  it('should handle submitAll error', fakeAsync(() => {
    spyOn(console, 'error');
    component.mode = 'update';
    mockTransactionGroupService.updateTransactionGroup.and.returnValue(throwError(() => new Error('Failed')));
    component.submitAll();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error submitting transaction group:', jasmine.any(Error));
  }));

  it('should goBack and navigate to pending transactions', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-pending-list']);
  });
});
