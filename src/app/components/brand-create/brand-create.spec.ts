import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrandCreate } from './brand-create';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('BrandCreate', () => {
  let component: BrandCreate;
  let fixture: ComponentFixture<BrandCreate>;
  let mockBrandService: jasmine.SpyObj<BrandService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockBrandService = jasmine.createSpyObj('BrandService', ['createBrand']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, BrandCreate], // <- include the standalone component
      providers: [
        { provide: BrandService, useValue: mockBrandService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandCreate);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.brandForm.valid).toBeFalse();
  });

  it('should validate required brand name', () => {
    const nameControl = component.brandForm.get('name')!;
    nameControl.setValue('');
    expect(nameControl.valid).toBeFalse();

    nameControl.setValue('Nike');
    expect(nameControl.valid).toBeTrue();
  });

  it('should not submit invalid form', () => {
    spyOn(component.brandForm, 'markAllAsTouched');
    component.submit();
    expect(component.brandForm.markAllAsTouched).toHaveBeenCalled();
    expect(mockBrandService.createBrand).not.toHaveBeenCalled();
  });

  it('should submit valid form and navigate on success', fakeAsync(() => {
    const nameControl = component.brandForm.get('name')!;
    nameControl.setValue('Nike');

    // Return a proper BrandDto
    mockBrandService.createBrand.and.returnValue(of({ id: '123', name: 'Nike' }));
    spyOn(window, 'alert');

    component.submit();
    tick();

    expect(mockBrandService.createBrand).toHaveBeenCalledWith({ name: 'Nike', url: '' });
    expect(window.alert).toHaveBeenCalledWith('Brand created successfully!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-update']);
  }));


  it('should alert on createBrand error', fakeAsync(() => {
    const nameControl = component.brandForm.get('name')!;
    nameControl.setValue('Nike');

    mockBrandService.createBrand.and.returnValue(throwError(() => new Error('Failed')));
    spyOn(window, 'alert');

    component.submit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Failed to create brand.');
  }));

  it('should navigate to transaction update on goToAddTransactions', () => {
    component.goToAddTransactions();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-update']);
  });
});
