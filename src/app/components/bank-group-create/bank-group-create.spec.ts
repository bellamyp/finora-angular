import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BankGroupCreate } from './bank-group-create';
import { BankGroupService } from '../../services/bank-group.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { BankGroupDto } from '../../dto/bank-group.dto';
import { BankGroupCreateDto } from '../../dto/bank-group-create.dto';

describe('BankGroupCreate', () => {
  let component: BankGroupCreate;
  let fixture: ComponentFixture<BankGroupCreate>;
  let mockBankGroupService: jasmine.SpyObj<BankGroupService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockBankGroupService = jasmine.createSpyObj('BankGroupService', ['getBankGroups', 'createBankGroup']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Provide a default spy return before component creation
    mockBankGroupService.getBankGroups.and.returnValue(of([
      { id: 'G1', name: 'Existing Group' }
    ]));

    await TestBed.configureTestingModule({
      imports: [BankGroupCreate, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: BankGroupService, useValue: mockBankGroupService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BankGroupCreate);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.existingGroups.length).toBe(1);
  });

  it('should mark name as taken if duplicate', fakeAsync(() => {
    component.groupForm.controls['name'].setValue('Existing Group');
    tick(500); // simulate debounceTime
    expect(component.isNameTaken).toBeTrue();
    expect(component.eligibilityStatus).toContain('already taken');
  }));

  it('should mark name as available if unique', fakeAsync(() => {
    component.groupForm.controls['name'].setValue('New Group');
    tick(500); // simulate debounceTime
    expect(component.isNameTaken).toBeFalse();
    expect(component.eligibilityStatus).toContain('available');
  }));

  it('should not submit if form invalid or name taken', () => {
    component.groupForm.controls['name'].setValue('');
    component.submit();
    expect(mockBankGroupService.createBankGroup).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();

    component.groupForm.controls['name'].setValue('Existing Group');
    component.isNameTaken = true;
    component.submit();
    expect(mockBankGroupService.createBankGroup).not.toHaveBeenCalled();
  });

  it('should submit valid form and navigate on success', fakeAsync(() => {
    spyOn(window, 'alert');
    const payload: BankGroupCreateDto = { name: 'New Group' };
    const response: BankGroupDto = { id: 'G2', name: 'New Group' };

    component.groupForm.controls['name'].setValue('New Group');
    tick(500); // debounce

    mockBankGroupService.createBankGroup.and.returnValue(of(response));

    component.submit();

    expect(mockBankGroupService.createBankGroup).toHaveBeenCalledWith(payload);
    expect(window.alert).toHaveBeenCalledWith('Bank Group "New Group" created successfully!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank-create']);
  }));

  it('should handle API failure on submit', fakeAsync(() => {
    spyOn(window, 'alert');
    component.groupForm.controls['name'].setValue('Fail Group');
    tick(500); // debounce

    mockBankGroupService.createBankGroup.and.returnValue(throwError(() => new Error('Server error')));

    component.submit();

    expect(window.alert).toHaveBeenCalledWith('Failed to create bank group.');
    expect(component.isSubmitting).toBeFalse();
  }));

  it('should navigate to bank create page when goToBankCreate is called', () => {
    component.goToBankCreate();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank-create']);
  });
});
