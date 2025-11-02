import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BankCreate } from './bank-create';
import { BankService } from '../../services/bank.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import {BankDto} from '../../dto/bank.dto';
import {BankCreateDto} from '../../dto/bank-create.dto';


describe('BankCreate', () => {

  let component: BankCreate;
  let fixture: ComponentFixture<BankCreate>;
  let mockBankService: jasmine.SpyObj<BankService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockBankService = jasmine.createSpyObj('BankService', ['createBank']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    mockAuthService.getCurrentUser.and.returnValue({ email: 'test@email.com', role: 'ROLE_USER' });

    await TestBed.configureTestingModule({
      imports: [BankCreate, ReactiveFormsModule],
      providers: [
        { provide: BankService, useValue: mockBankService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate userEmail from AuthService and disable the field', () => {
    const userEmailControl = component.bankForm.get('userEmail');
    expect(userEmailControl?.value).toBe('test@email.com');
    expect(userEmailControl?.disabled).toBeTrue();
  });

  it('should mark form invalid if required fields are empty', () => {
    component.bankForm.get('name')?.setValue('');
    component.bankForm.get('openingDate')?.setValue('');
    component.bankForm.get('type')?.setValue('');
    expect(component.bankForm.valid).toBeFalse();
  });

  it('should call createBank on submit when form is valid', fakeAsync(() => {
    const formValue: BankCreateDto = {
      name: 'Test Bank',
      openingDate: '2025-11-02',
      closingDate: null,
      type: 'CHECKING',          // now correctly typed
      userEmail: 'test@email.com'
    };

    const mockResponse: BankDto = {
      id: 123,
      name: formValue.name,
      type: formValue.type,
      email: formValue.userEmail
    };

    mockBankService.createBank.and.returnValue(of(mockResponse));

    // set form values
    component.bankForm.get('name')?.setValue(formValue.name);
    component.bankForm.get('openingDate')?.setValue(formValue.openingDate);
    component.bankForm.get('closingDate')?.setValue(formValue.closingDate);
    component.bankForm.get('type')?.setValue(formValue.type);

    component.submit();
    tick();

    expect(mockBankService.createBank).toHaveBeenCalledWith(formValue);
  }));

  it('should alert error on submit failure', fakeAsync(() => {
    spyOn(window, 'alert');
    const formValue = {
      name: 'Test Bank',
      openingDate: '2025-11-02',
      closingDate: null,
      type: 'CHECKING',
      userEmail: 'test@email.com'
    };

    mockBankService.createBank.and.returnValue(throwError(() => new Error('Backend error')));

    // set form values
    component.bankForm.get('name')?.setValue(formValue.name);
    component.bankForm.get('openingDate')?.setValue(formValue.openingDate);
    component.bankForm.get('closingDate')?.setValue(formValue.closingDate);
    component.bankForm.get('type')?.setValue(formValue.type);

    component.submit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Error creating bank: Backend error');
  }));
});
