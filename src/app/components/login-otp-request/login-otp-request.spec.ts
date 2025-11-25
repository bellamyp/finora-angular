import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginOtpRequest } from './login-otp-request';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import {provideRouter} from '@angular/router';

describe('LoginOtpRequest', () => {
  let component: LoginOtpRequest;
  let fixture: ComponentFixture<LoginOtpRequest>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['requestOtp']);

    await TestBed.configureTestingModule({
      imports: [
        LoginOtpRequest,
        FormsModule
      ],
      providers: [
        provideHttpClientTesting(),
        provideRouter([
          { path: 'login-otp-confirm', component: LoginOtpRequest }, // add test route
        ]),
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginOtpRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set error if email is empty', () => {
    component.email = '';
    component.sendOtp();
    expect(component.error).toBe('Please enter your email');
    expect(component.sending).toBeFalse();
  });

  it('should call authService.requestOtp and navigate on success', fakeAsync(() => {
    component.email = 'test@example.com';
    mockAuthService.requestOtp.and.returnValue(of({ success: true, message: '' }));

    component.sendOtp();
    tick();

    expect(mockAuthService.requestOtp).toHaveBeenCalledWith('test@example.com');
    expect(component.error).toBeNull();
    expect(component.sending).toBeFalse();
  }));

  it('should set error if requestOtp response is failure', fakeAsync(() => {
    component.email = 'test@example.com';
    mockAuthService.requestOtp.and.returnValue(of({ success: false, message: 'Invalid email' }));

    component.sendOtp();
    tick();

    expect(component.error).toBe('Invalid email');
    expect(component.sending).toBeFalse();
  }));

  it('should handle requestOtp errors', fakeAsync(() => {
    component.email = 'test@example.com';

    // simulate server error
    mockAuthService.requestOtp.and.returnValue(throwError(() => ({ type: 'server' })));
    component.sendOtp();
    tick();
    expect(component.error).toBe('Server error. Please try again later.');
    expect(component.sending).toBeFalse();

    // simulate network error
    mockAuthService.requestOtp.and.returnValue(throwError(() => ({ type: 'network' })));
    component.sendOtp();
    tick();
    expect(component.error).toBe('Network unavailable. Check your connection.');
    expect(component.sending).toBeFalse();

    // simulate unknown error
    mockAuthService.requestOtp.and.returnValue(throwError(() => ({})));
    component.sendOtp();
    tick();
    expect(component.error).toBe('Unknown error occurred.');
    expect(component.sending).toBeFalse();
  }));
});
