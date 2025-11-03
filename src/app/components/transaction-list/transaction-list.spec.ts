import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionList } from './transaction-list';
import { TransactionService } from '../../services/transaction-service';
import { of, throwError } from 'rxjs';
import { TransactionDto } from '../../dto/transaction.dto';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TransactionList', () => {
  let component: TransactionList;
  let fixture: ComponentFixture<TransactionList>;
  let mockTransactionService: any;

  const mockTransactions: TransactionDto[] = [
    { id: 9, date: '2025-10-09', amount: 250, type: 'SAVINGS', notes: 'Savings transfer', bankName: 'Capital One Savings', userEmail: 'bellamyphan@icloud.com' },
    { id: 10, date: '2025-10-10', amount: 30, type: 'PET', notes: 'Pet supplies', bankName: 'Capital One Savings', userEmail: 'bellamyphan@icloud.com' }
  ];

  beforeEach(async () => {
    mockTransactionService = jasmine.createSpyObj('TransactionService', ['getTransactionsByEmail']);

    await TestBed.configureTestingModule({
      imports: [TransactionList],
      providers: [
        provideHttpClientTesting(), // ✅ modern replacement
        { provide: TransactionService, useValue: mockTransactionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions if user email exists in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'bellamyphan@icloud.com' }));
    mockTransactionService.getTransactionsByEmail.and.returnValue(of(mockTransactions));

    component.ngOnInit();

    expect(component.userEmail).toBe('bellamyphan@icloud.com');
    expect(component.transactions.length).toBe(2);
    expect(component.transactions[0].type).toBe('SAVINGS');
    expect(component.loading).toBeFalse();
  });

  it('should handle missing user in localStorage', () => {
    component.ngOnInit();

    expect(component.userEmail).toBeNull();
    expect(component.transactions.length).toBe(0);
    expect(component.loading).toBeFalse();
  });

  it('should handle invalid JSON in localStorage', () => {
    localStorage.setItem('user', '{invalidJson');
    spyOn(console, 'error');

    component.ngOnInit();

    expect(component.userEmail).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Invalid user data in localStorage');
    expect(component.loading).toBeFalse();
  });

  it('should handle service error', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'bellamyphan@icloud.com' }));
    mockTransactionService.getTransactionsByEmail.and.returnValue(throwError(() => new Error('Service failed')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(component.transactions.length).toBe(0);
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Failed to fetch transactions:', jasmine.any(Error));
  });
});
