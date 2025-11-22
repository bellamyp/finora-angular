import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-otp-request',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './login-otp-request.html',
  styleUrl: './login-otp-request.scss',
})
export class LoginOtpRequest {

  email: string = '';
  error: string | null = null;
  sending: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  sendOtp() {
    console.log('sendOtp() called with email:', this.email);

    if (!this.email) {
      this.error = 'Please enter your email';
      console.log('No email entered. Exiting sendOtp()');
      return;
    }

    this.error = null;
    this.sending = true;
    console.log('Sending OTP request...');

    this.authService.requestOtp(this.email).subscribe({
      next: (response) => {
        console.log('OTP request response received:', response);
        this.sending = false;

        if (response?.success) {
          console.log('Navigating to /login-otp-confirm with email:', this.email);
          this.router.navigate(['/login-otp-confirm'], { queryParams: { email: this.email } });
        } else {
          this.error = response?.message || 'Failed to send OTP. Please try again.';
          console.log('Failed to send OTP. Error message set:', this.error);
        }
      },
      error: (err) => {
        this.sending = false;
        this.error = 'Server error. Please try again later.';
        console.error('OTP request failed with error:', err);
      }
    });
  }
}
