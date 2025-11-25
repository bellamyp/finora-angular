import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login-otp-request',
  imports: [
    RouterLink,
    FormsModule,
    NgIf
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
    if (!this.email) {
      this.error = 'Please enter your email';
      return;
    }

    this.error = null;
    this.sending = true;

    this.authService.requestOtp(this.email).subscribe({
      next: response => {
        this.sending = false;

        if (response?.success) {
          this.router.navigate(['/login-otp-confirm'], { queryParams: { email: this.email } });
        } else {
          this.error = response?.message || 'Failed to send OTP. Please try again.';
          window.alert(`❌ ${this.error}`);
        }
      },
      error: err => {
        this.sending = false;

        if (err.type === 'server') {
          this.error = 'Server error. Please try again later.';
        } else if (err.type === 'network') {
          this.error = 'Network unavailable. Check your connection.';
        } else {
          this.error = 'Unknown error occurred.';
        }

        window.alert(`❌ ${this.error}`);
        console.error('OTP request failed with error:', err);
      }
    });
  }
}
