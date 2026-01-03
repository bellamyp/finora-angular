import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankView } from './bank-view';
import { BankService } from '../../services/bank.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BankDto } from '../../dto/bank.dto';

describe('BankView', () => {
  let component: BankView;
  let fixture: ComponentFixture<BankView>;
  let mockBankService: jasmine.SpyObj<BankService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockBank: BankDto = {
    id: '123',
    groupId: 'group1',          // <-- added groupId
    name: 'Checking Bank',
    type: 'CHECKING',
    email: 'user@example.com',
    pendingBalance: 1500.25
  };

  beforeEach(async () => {
    mockBankService = jasmine.createSpyObj('BankService', ['getBankById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (_key: string) => '123' // return bankId
        }
      }
    };

    mockBankService.getBankById.and.returnValue(of(mockBank));

    await TestBed.configureTestingModule({
      imports: [BankView],
      providers: [
        { provide: BankService, useValue: mockBankService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankView);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bank on init', () => {
    expect(component.bank).toEqual(mockBank);
    expect(component.bank?.groupId).toBe('group1'); // <-- check groupId
    expect(component.loading).toBeFalse();
    expect(component.error).toBeUndefined();
  });

  it('should handle missing bankId in route', () => {
    const routeSpy = {
      snapshot: {
        paramMap: { get: (_key: string) => null }
      }
    } as any;

    const comp = new BankView(routeSpy, mockRouter, mockBankService);
    comp.ngOnInit();

    expect(comp.bank).toBeUndefined();
    expect(comp.error).toBe('Bank ID not found in route.');
    expect(comp.loading).toBeFalse();
  });

  it('should handle error from BankService', () => {
    mockBankService.getBankById.and.returnValue(throwError(() => new Error('Failed')));
    const comp = new BankView(mockActivatedRoute, mockRouter, mockBankService);
    comp.ngOnInit();

    comp.ngOnInit();
    mockBankService.getBankById('123').subscribe({
      error: () => {
        expect(comp.error).toBe('Failed to load bank details.');
        expect(comp.loading).toBeFalse();
      }
    });
  });

  it('should navigate to main menu', () => {
    component.goToMainMenu();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu-user']);
  });

  it('should navigate to bank list', () => {
    component.goToBankList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank-list']);
  });

  it('should alert when edit bank clicked', () => {
    spyOn(window, 'alert');
    component.editBank();
    expect(window.alert).toHaveBeenCalledWith('Edit bank not implemented yet!');
  });
});
