import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionSearch } from './transaction-search';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { TransactionService } from '../../services/transaction.service';

describe('TransactionSearch', () => {
  let component: TransactionSearch;
  let fixture: ComponentFixture<TransactionSearch>;
  let mockBankService: any;
  let mockBrandService: any;
  let mockTransactionService: any;
  let mockRouter: any;

  beforeEach(async () => {
    // Jasmine spies for services
    mockBankService = jasmine.createSpyObj('BankService', ['getBanks']);
    mockBankService.getBanks.and.returnValue(of([{ id: 'bank1', name: 'Bank 1' }]));

    mockBrandService = jasmine.createSpyObj('BrandService', ['getBrandsByUser']);
    mockBrandService.getBrandsByUser.and.returnValue(of([{ id: 'brand1', name: 'Brand 1', location: 'NY' }]));

    mockTransactionService = jasmine.createSpyObj('TransactionService', ['searchTransactions']);
    mockTransactionService.searchTransactions.and.returnValue(of([
      {
        id: 'tx1',
        groupId: 'group1',
        bankId: 'bank1',
        brandId: 'brand1',
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
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load banks and brands on init', fakeAsync(() => {
    tick();
    expect(component.banks.length).toBe(1);
    expect(component.brands.length).toBe(1);
  }));

  it('should perform search and map results', fakeAsync(() => {
    component.onSearch();
    tick();

    expect(component.results.length).toBe(1);
    expect(component.results[0].bankName).toBe('Bank 1');
    expect(component.results[0].brandName).toBe('Brand 1 (NY)');
    expect(component.results[0].typeName).toBe('INCOME');
    expect(component.loading).toBe(false);
  }));

  it('should handle search errors', fakeAsync(() => {
    mockTransactionService.searchTransactions.and.returnValue(throwError(() => new Error('Fail')));
    component.onSearch();
    tick();

    expect(component.results.length).toBe(0);
    expect(component.loading).toBe(false);
  }));

  it('should navigate to transaction group', () => {
    component.openTransactionGroup('group1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-view', 'group1']);
  });
});
