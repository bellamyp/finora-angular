import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LocationCreate } from './location-create';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { of, throwError } from 'rxjs';
import { LocationCreateDto } from '../../dto/location-create.dto';
import {LocationDto} from '../../dto/location.dto';

describe('LocationCreate', () => {
  let component: LocationCreate;
  let fixture: ComponentFixture<LocationCreate>;

  let mockLocationService: jasmine.SpyObj<LocationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockLocation: LocationDto = {
    id: 'loc1',
    city: 'New York',
    state: 'NY'
  };

  beforeEach(async () => {
    mockLocationService = jasmine.createSpyObj('LocationService', ['createLocation']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LocationCreate],
      providers: [
        FormBuilder,
        { provide: LocationService, useValue: mockLocationService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty city and state', () => {
    expect(component.locationForm).toBeTruthy();
    expect(component.locationForm.value).toEqual({ city: '', state: '' });
    expect(component.locationForm.valid).toBeFalse();
  });

  it('should mark form invalid when empty and prevent submit', () => {
    component.submit();
    expect(component.locationForm.touched).toBeTrue();
  });

  it('should call locationService.createLocation and navigate on successful submit', fakeAsync(() => {
    const payload: LocationCreateDto = { city: 'New York', state: 'NY' };
    component.locationForm.setValue(payload);

    mockLocationService.createLocation.and.returnValue(of(mockLocation));

    spyOn(window, 'alert');

    component.submit();
    tick();

    expect(mockLocationService.createLocation).toHaveBeenCalledWith(payload);
    expect(window.alert).toHaveBeenCalledWith('Location created successfully!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-update']);
  }));

  it('should alert on failed submit', fakeAsync(() => {
    const payload: LocationCreateDto = { city: 'Los Angeles', state: 'CA' };
    component.locationForm.setValue(payload);

    mockLocationService.createLocation.and.returnValue(
      throwError(() => new Error('Server error'))
    );

    spyOn(window, 'alert');
    spyOn(console, 'error');

    component.submit();
    tick();

    expect(mockLocationService.createLocation).toHaveBeenCalledWith(payload);
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to create location.');
  }));

  it('should navigate to /transaction-update when goToAddTransactions is called', () => {
    component.goToAddTransactions();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/transaction-update']);
  });

  it('should mark city and state controls as touched when form invalid', () => {
    component.locationForm.setValue({ city: '', state: '' });
    component.submit();
    expect(component.locationForm.get('city')?.touched).toBeTrue();
    expect(component.locationForm.get('state')?.touched).toBeTrue();
  });

  it('should disable submit button if form invalid', () => {
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();

    component.locationForm.setValue({ city: 'Test', state: 'TS' });
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();
  });
});
