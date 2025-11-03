import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionCreate } from './transaction-create';
import { of } from 'rxjs';
import { TransactionService } from '../../services/transaction-service';
import { BankService } from '../../services/bank.service';
import { AuthService } from '../../services/auth.service';
import { TransactionDto } from '../../dto/transaction.dto';
import { TransactionTypeEnum } from '../../dto/transaction-type.enum';

describe('TransactionCreate', () => {
  let component: TransactionCreate;
  let fixture: ComponentFixture<TransactionCreate>;

  // Mock services
  const mockTransactionService = {
    createTransaction: jasmine.createSpy('createTransaction').and.returnValue(
      of({ id: 1 } as TransactionDto)
    )
  };

  const mockBankService = {
    getBanksByUserEmail: jasmine.createSpy('getBanksByUserEmail').and.returnValue(
      of([{ id: 1, name: 'Capital One Savings' }])
    )
  };

  const mockAuthService = {
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({
      email: 'test@example.com',
      role: 'USER'
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionCreate],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: BankService, useValue: mockBankService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockTransactionService.createTransaction.calls.reset();
    mockBankService.getBanksByUserEmail.calls.reset();
    mockAuthService.getCurrentUser.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user email and banks on init', () => {
    expect(component.userEmail).toBe('test@example.com');
    expect(component.banks.length).toBe(1);
    expect(component.banks[0].name).toBe('Capital One Savings');
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(mockBankService.getBanksByUserEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should submit transaction', () => {
    component.date = '2025-11-02';
    component.amount = 100;
    component.type = TransactionTypeEnum.GROCERY;
    component.bankId = 1;
    component.notes = 'Test transaction';

    // Use a fake form object
    const fakeForm: any = {
      invalid: false,
      resetForm: jasmine.createSpy('resetForm')
    };

    component.submitTransaction(fakeForm);

    expect(mockTransactionService.createTransaction).toHaveBeenCalledWith({
      date: '2025-11-02',
      amount: 100,
      type: TransactionTypeEnum.GROCERY,
      notes: 'Test transaction',
      bankId: 1,
      userEmail: 'test@example.com'
    });

    expect(fakeForm.resetForm).toHaveBeenCalled();
  });

  it('should not submit invalid form', () => {
    const fakeForm: any = { invalid: true, resetForm: jasmine.createSpy('resetForm') };
    component.submitTransaction(fakeForm);
    expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    expect(fakeForm.resetForm).not.toHaveBeenCalled();
  });
});
