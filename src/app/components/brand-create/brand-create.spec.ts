import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrandCreate } from './brand-create';
import { BrandService } from '../../services/brand.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BrandCreateDto } from '../../dto/brand-create.dto';

describe('BrandCreate', () => {
  let component: BrandCreate;
  let fixture: ComponentFixture<BrandCreate>;
  let mockBrandService: jasmine.SpyObj<BrandService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockBrandService = jasmine.createSpyObj('BrandService', ['createBrand']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BrandCreate, ReactiveFormsModule], // standalone component goes in imports
      providers: [
        { provide: BrandService, useValue: mockBrandService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockBrandService.createBrand.calls.reset();
    mockRouter.navigate.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form invalid if required fields are empty', () => {
    component.brandForm.get('name')?.setValue('');
    expect(component.brandForm.valid).toBeFalse();
  });

  it('should call createBrand on submit when form is valid', fakeAsync(() => {
    const formValue: BrandCreateDto = { name: 'Test Brand', location: 'Test Location' };

    // Mock the service to return a proper BrandDto
    const mockResponse = { id: 'abc123', name: formValue.name, location: formValue.location };
    mockBrandService.createBrand.and.returnValue(of(mockResponse));

    component.brandForm.get('name')?.setValue(formValue.name);
    component.brandForm.get('location')?.setValue(formValue.location);

    component.submit();
    tick();

    expect(mockBrandService.createBrand).toHaveBeenCalledWith(formValue);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transactions-create']);
  }));

  it('should alert error on submit failure', fakeAsync(() => {
    spyOn(window, 'alert');
    const formValue: BrandCreateDto = { name: 'Test Brand', location: 'Test Location' };

    mockBrandService.createBrand.and.returnValue(throwError(() => new Error('Backend error')));

    component.brandForm.get('name')?.setValue(formValue.name);
    component.brandForm.get('location')?.setValue(formValue.location);

    component.submit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Failed to create brand.');
  }));
});
