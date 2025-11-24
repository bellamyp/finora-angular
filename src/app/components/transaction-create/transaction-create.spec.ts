import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TransactionCreate } from './transaction-create';
import { of } from 'rxjs';
import { BrandService } from '../../services/brand.service';
import { BankService } from '../../services/bank.service';
import { TransactionGroupService } from '../../services/transaction-group.service';
import {ActivatedRoute, Router} from '@angular/router';
import { TransactionTypeEnum } from '../../dto/transaction-type.enum';

// Dummy route component
import { Component } from '@angular/core';
@Component({ template: '' })
class DummyComponent {}

describe('TransactionCreate', () => {
  let component: TransactionCreate;
  let fixture: ComponentFixture<TransactionCreate>;

  const mockBrandService = {
    getBrandsByUser: jasmine.createSpy('getBrandsByUser').and.returnValue(
      of([{ id: 'b1', name: 'Nike', location: 'Houston' }])
    )
  };

  const mockBankService = {
    getBanks: jasmine.createSpy('getBanks').and.returnValue(
      of([{ id: 'bank1', name: 'Chase' }])
    )
  };

  const mockTransactionGroupService = {
    createTransactionGroup: jasmine.createSpy('createTransactionGroup').and.returnValue(
      of({ success: true, groupId: 'tg1', message: 'Transaction group created successfully' })
    )
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    createUrlTree: jasmine.createSpy('createUrlTree').and.callFake(() => ({})),
    serializeUrl: jasmine.createSpy('serializeUrl').and.callFake(url => url),
    events: of()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, TransactionCreate],
      providers: [
        { provide: BrandService, useValue: mockBrandService },
        { provide: BankService, useValue: mockBankService },
        { provide: TransactionGroupService, useValue: mockTransactionGroupService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} } // <-- ADD THIS
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockBrandService.getBrandsByUser.calls.reset();
    mockBankService.getBanks.calls.reset();
    mockTransactionGroupService.createTransactionGroup.calls.reset();
    mockRouter.navigate.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load banks and brands on init', () => {
    expect(component.banks.length).toBe(1);
    expect(component.brands.length).toBe(1);
  });

  it('should add and remove transactions', () => {
    const initialLength = component.transactions.length;
    component.addTransaction();
    expect(component.transactions.length).toBe(initialLength + 1);

    component.removeTransaction(0);
    expect(component.transactions.length).toBe(initialLength);
  });

  it('should submit transaction group successfully', () => {
    spyOn(window, 'alert');

    component.selectedBrandId = 'b1';
    component.typeId = TransactionTypeEnum.GROCERY;
    component.transactions = [{ amount: 100, bankId: 'bank1', notes: 'Test' }];
    component.groupDate = '2025-11-23';

    component.submitGroup();

    expect(mockTransactionGroupService.createTransactionGroup).toHaveBeenCalledWith({
      date: '2025-11-23',
      brandId: 'b1',
      typeId: TransactionTypeEnum.GROCERY,
      transactions: [{ amount: 100, bankId: 'bank1', notes: 'Test' }]
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-pending-list']);
    expect(window.alert).toHaveBeenCalledWith(
      'Transaction group created and added to the Pending Transactions list! ID: tg1'
    );
  });

  it('should not submit if brand or type is missing', () => {
    spyOn(window, 'alert');

    // missing brand
    component.selectedBrandId = undefined;
    component.typeId = TransactionTypeEnum.GROCERY;
    component.submitGroup();
    expect(mockTransactionGroupService.createTransactionGroup).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Please select a brand from the dropdown.');

    // missing type
    component.selectedBrandId = 'b1';
    component.typeId = undefined;
    component.submitGroup();
    expect(mockTransactionGroupService.createTransactionGroup).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Please select a transaction type.');
  });

  it('should not submit if no transactions added', () => {
    spyOn(window, 'alert');

    component.transactions = [];
    component.selectedBrandId = 'b1';
    component.typeId = TransactionTypeEnum.GROCERY;

    component.submitGroup();

    expect(mockTransactionGroupService.createTransactionGroup).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('You must add at least one transaction.');
  });
});
