import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BankCreate } from './bank-create';
import { BankService } from '../../services/bank.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { BankEditDto } from '../../dto/bank-edit.dto';
import { BankGroupService } from '../../services/bank-group.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BankDto } from '../../dto/bank.dto';

describe('BankCreate', () => {
  let component: BankCreate;
  let fixture: ComponentFixture<BankCreate>;

  let mockBankService: jasmine.SpyObj<BankService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBankGroupService: jasmine.SpyObj<BankGroupService>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => null // default: no bankId (create mode)
      }
    }
  };

  beforeEach(async () => {
    mockBankService = jasmine.createSpyObj('BankService', ['createBank', 'getBankForEdit', 'updateBank']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockBankGroupService = jasmine.createSpyObj('BankGroupService', ['getBankGroups']);
    mockBankGroupService.getBankGroups.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        BankCreate,
        ReactiveFormsModule,
        CommonModule
      ],
      providers: [
        { provide: BankService, useValue: mockBankService },
        { provide: Router, useValue: mockRouter },
        { provide: BankGroupService, useValue: mockBankGroupService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --------------------------
  // INVALID FORM TEST
  // --------------------------
  it('should NOT submit invalid form', () => {
    component.bankForm.setValue({
      id: '', // ⚠ include id
      groupId: '',
      name: '',
      openingDate: '',
      closingDate: '',
      type: ''
    });

    component.submit();

    expect(mockBankService.createBank).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  // --------------------------
  // VALID FORM TEST (CREATE)
  // --------------------------
  it('should submit valid form (create)', () => {
    component.bankForm.setValue({
      id: '', // ⚠ include id
      groupId: 'G100',
      name: 'My Bank',
      openingDate: '2025-01-01',
      closingDate: '',
      type: 'CHECKING'
    });

    const mockResponse: BankDto = {
      id: '100',
      groupId: 'G100',
      name: 'My Bank',
      type: 'CHECKING',
      email: 'test@example.com',
      pendingBalance: 1000
    };

    mockBankService.createBank.and.returnValue(of(mockResponse));
    spyOn(window, 'alert');

    component.submit();

    expect(mockBankService.createBank).toHaveBeenCalledWith({
      id: undefined, // component converts '' to undefined for creation
      groupId: 'G100',
      name: 'My Bank',
      openingDate: '2025-01-01',
      closingDate: null, // empty string converts to null
      type: 'CHECKING'
    });

    expect(window.alert).toHaveBeenCalledWith('Bank created successfully!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank-list']);
  });

  // --------------------------
  // ERROR HANDLING TEST
  // --------------------------
  it('should show error alert when API fails', () => {
    spyOn(window, 'alert');

    component.bankForm.setValue({
      id: '', // ⚠ include id
      groupId: 'G200',
      name: 'Bad Bank',
      openingDate: '2025-01-01',
      closingDate: '',
      type: 'SAVINGS'
    });

    mockBankService.createBank.and.returnValue(
      throwError(() => new Error('Network down'))
    );

    component.submit();

    expect(window.alert).toHaveBeenCalledWith('Error creating bank: Network down');
  });

  it('should disable closing date if bank is closed', () => {
    const bank: BankEditDto = {
      id: '101',
      groupId: 'G100',
      name: 'Closed Bank',
      openingDate: '2020-01-01',
      closingDate: '2025-01-01',
      type: 'SAVINGS'
    };

    mockBankService.getBankForEdit.and.returnValue(of(bank));

    component.bankId = '101';
    component.mode = 'update';
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.bankForm.get('closingDate')?.disabled).toBeTrue();
  });

  it('should disable closing date on create by default', () => {
    component.mode = 'create';
    component.bankForm.get('closingDate')?.enable(); // reset
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.bankForm.get('closingDate')?.disabled).toBeTrue();
  });
});
