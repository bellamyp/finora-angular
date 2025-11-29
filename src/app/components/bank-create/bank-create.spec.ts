import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BankCreate } from './bank-create';
import { BankService } from '../../services/bank.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { BankDto } from '../../dto/bank.dto';
import {BankGroupService} from '../../services/bank-group.service';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('BankCreate', () => {
  let component: BankCreate;
  let fixture: ComponentFixture<BankCreate>;

  let mockBankService: jasmine.SpyObj<BankService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockBankGroupService: jasmine.SpyObj<BankGroupService>;

  beforeEach(async () => {
    mockBankService = jasmine.createSpyObj('BankService', ['createBank']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockBankGroupService = jasmine.createSpyObj('BankGroupService', ['getBankGroups']);
    mockBankGroupService.getBankGroups.and.returnValue(of([])); // mock call if component calls it

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
        provideHttpClientTesting()  // << provide HttpClient to satisfy DI
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
      groupId: '',   // missing group
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
  // VALID FORM TEST
  // --------------------------
  it('should submit valid form', () => {
    component.bankForm.setValue({
      groupId: 'G100', // <-- required
      name: 'My Bank',
      openingDate: '2025-01-01',
      closingDate: '',
      type: 'CHECKING'
    });

    const mockResponse: BankDto = {
      id: '100',
      name: 'My Bank',
      type: 'CHECKING',
      email: 'test@example.com',
      balance: 1000
    };

    mockBankService.createBank.and.returnValue(of(mockResponse));

    spyOn(window, 'alert');

    component.submit();

    expect(mockBankService.createBank).toHaveBeenCalledWith({
      groupId: 'G100', // <-- included
      name: 'My Bank',
      openingDate: '2025-01-01',
      closingDate: null,
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
      groupId: 'G200',  // <-- required
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
});
