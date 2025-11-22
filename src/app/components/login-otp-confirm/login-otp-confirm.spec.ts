import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginOtpConfirm } from './login-otp-confirm';
import { AuthService } from '../../services/auth.service';

describe('LoginOtpConfirm', () => {
  let component: LoginOtpConfirm;
  let fixture: ComponentFixture<LoginOtpConfirm>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'getCurrentUserRole',
      'verifyOtp',
      'requestOtp'
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginOtpConfirm, FormsModule],
      providers: [
        provideHttpClientTesting(),
        provideRouter([]), // dummy router
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ email: 'test@example.com' }) } // ✅ proper token
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginOtpConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get email from query params on init', () => {
    component.ngOnInit();
    expect(component.email).toBe('test@example.com');
  });

  it('should alert if OTP is incomplete', () => {
    spyOn(window, 'alert');
    component.otp1 = '1';
    component.otp2 = '2';
    component.verifyOtp();
    expect(window.alert).toHaveBeenCalledWith('❌ Please enter the complete 6-digit OTP.');
  });

  it('should navigate to Admin Menu on successful OTP verification for admin', fakeAsync(() => {
    mockAuthService.verifyOtp.and.returnValue(of({} as any));
    mockAuthService.getCurrentUserRole.and.returnValue('ROLE_ADMIN');
    spyOn(component['router'], 'navigate');

    component.otp1 = '1';
    component.otp2 = '2';
    component.otp3 = '3';
    component.otp4 = '4';
    component.otp5 = '5';
    component.otp6 = '6';

    component.verifyOtp();
    tick();

    expect(mockAuthService.verifyOtp).toHaveBeenCalledWith('test@example.com', '123456');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/menu-admin']);
  }));

  it('should navigate to User Menu on successful OTP verification for user', fakeAsync(() => {
    mockAuthService.verifyOtp.and.returnValue(of({} as any));
    mockAuthService.getCurrentUserRole.and.returnValue('ROLE_USER');
    spyOn(component['router'], 'navigate');
    spyOn(window, 'alert');

    component.otp1 = '1';
    component.otp2 = '2';
    component.otp3 = '3';
    component.otp4 = '4';
    component.otp5 = '5';
    component.otp6 = '6';

    component.verifyOtp();
    tick();

    expect(component['router'].navigate).toHaveBeenCalledWith(['/menu-user']);
    expect(window.alert).not.toHaveBeenCalledWith('❌ Invalid or expired OTP.');
  }));

  it('should alert if OTP verification fails', fakeAsync(() => {
    mockAuthService.verifyOtp.and.returnValue(of(null));
    spyOn(window, 'alert');

    component.otp1 = '1';
    component.otp2 = '2';
    component.otp3 = '3';
    component.otp4 = '4';
    component.otp5 = '5';
    component.otp6 = '6';

    component.verifyOtp();
    tick();

    expect(window.alert).toHaveBeenCalledWith('❌ Invalid or expired OTP.');
  }));

  it('should handle errors during OTP verification', fakeAsync(() => {
    mockAuthService.verifyOtp.and.returnValue(throwError(() => new Error('Network error')));
    spyOn(window, 'alert');

    component.otp1 = '1';
    component.otp2 = '2';
    component.otp3 = '3';
    component.otp4 = '4';
    component.otp5 = '5';
    component.otp6 = '6';

    component.verifyOtp();
    tick();

    expect(window.alert).toHaveBeenCalledWith('❌ Server error. Please try again later.');
  }));

  it('should resend OTP successfully', fakeAsync(() => {
    mockAuthService.requestOtp.and.returnValue(of({ success: true, message: 'OTP sent' }));
    spyOn(window, 'alert');

    component.email = 'test@example.com';
    component.resendOtp();
    tick();

    expect(mockAuthService.requestOtp).toHaveBeenCalledWith('test@example.com');
    expect(window.alert).toHaveBeenCalledWith('✅ OTP resent successfully.');
  }));

  it('should alert if resend OTP fails', fakeAsync(() => {
    spyOn(window, 'alert');

    component.email = 'test@example.com';
    mockAuthService.requestOtp.and.returnValue(
      of({ success: false, message: 'Failed to send OTP' })
    );

    component.resendOtp();
    tick();

    expect(mockAuthService.requestOtp).toHaveBeenCalledWith('test@example.com');
    expect(window.alert).toHaveBeenCalledWith('❌ Failed to resend OTP.');
  }));

  it('should handle errors during resend OTP', fakeAsync(() => {
    mockAuthService.requestOtp.and.returnValue(throwError(() => new Error('Network error')));
    spyOn(window, 'alert');

    component.email = 'test@example.com';
    component.resendOtp();
    tick();

    expect(window.alert).toHaveBeenCalledWith('❌ Server error. Please try again later.');
  }));
});
