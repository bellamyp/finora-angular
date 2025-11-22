import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {UserDTO} from '../../dto/user.dto';

@Component({
  selector: 'app-login-otp-confirm',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login-otp-confirm.html',
  styleUrl: './login-otp-confirm.scss',
})
export class LoginOtpConfirm implements OnInit {

  email: string = '';
  otp1 = '';
  otp2 = '';
  otp3 = '';
  otp4 = '';
  otp5 = '';
  otp6 = '';

  error: string | null = null;       // ✅ to show OTP verification errors
  sending: boolean = false;          // ✅ to disable button while sending

  // New: capture all input elements
  @ViewChildren('otpInput1, otpInput2, otpInput3, otpInput4, otpInput5, otpInput6') otpInputs!: QueryList<ElementRef>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getCurrentUserRole();
      if (role === 'ROLE_ADMIN') {
        this.router.navigate(['/menu-admin']);
      } else {
        this.router.navigate(['/menu-user']);
      }
    }

    // Get email from query params
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
        console.log('OTP for email:', this.email);
      }
    });
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const inputs = this.otpInputs.toArray();
    const target = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      // Move focus to previous input if current is empty
      if (!target.value && index > 1) {
        inputs[index - 2].nativeElement.focus();
      }
      return;
    }

    // Only allow numeric input
    if (/^[0-9]$/.test(event.key)) {
      // Let ngModel handle the value
      // Move focus to next input automatically
      if (index < inputs.length) {
        setTimeout(() => inputs[index].nativeElement.focus(), 0);
      }
      return;
    }

    // Block non-numeric keys except Tab
    if (event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  get otp() {
    const otpValue = this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
    console.log('Current OTP value:', otpValue);
    return otpValue;
  }

  /** Verify OTP against backend */
  verifyOtp() {
    if (!this.otp || this.otp.length < 6) {
      window.alert('❌ Please enter the complete 6-digit OTP.');
      return;
    }

    this.sending = true;
    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: (user: UserDTO | null) => {
        this.sending = false;
        if (user) {
          const role = this.authService.getCurrentUserRole();
          if (role === 'ROLE_ADMIN') {
            console.log('✅ OTP verified. Redirecting to Admin Menu...');
            this.router.navigate(['/menu-admin']);
          } else {
            window.alert('✅ OTP verified. Redirecting to User Menu...');
            this.router.navigate(['/menu-user']);
          }
        } else {
          window.alert('❌ Invalid or expired OTP.');
        }
      },
      error: (err) => {
        this.sending = false;
        console.error('OTP verification failed:', err);
        window.alert('❌ Server error. Please try again later.');
      }
    });
  }

  /** Resend OTP */
  resendOtp() {
    this.sending = true;
    this.authService.requestOtp(this.email).subscribe({
      next: (res) => {
        this.sending = false;
        if (res?.success) {                     // ✅ check the success property
          window.alert('✅ OTP resent successfully.');
        } else {
          window.alert('❌ Failed to resend OTP.');
        }
      },
      error: (err) => {
        this.sending = false;
        console.error('Resend OTP failed:', err);
        window.alert('❌ Server error. Please try again later.');
      }
    });
  }
}
