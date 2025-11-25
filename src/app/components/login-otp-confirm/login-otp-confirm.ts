import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  error: string | null = null;
  sending: boolean = false;

  // Capture all OTP input elements
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getCurrentUserRole();
      this.router.navigate([role === 'ROLE_ADMIN' ? '/menu-admin' : '/menu-user']);
    }

    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  get otp(): string {
    return this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const inputs = this.otpInputs.toArray();
    const target = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace') {
      if (!target.value && index > 1) {
        inputs[index - 2].nativeElement.focus();
      }
      return;
    }

    // Handle numeric input
    if (/^[0-9]$/.test(event.key)) {
      setTimeout(() => {
        if (index < inputs.length) {
          inputs[index].nativeElement.focus();
        }
        if (this.otp.length === 6) {
          this.verifyOtp();
        }
      }, 0);
      return;
    }

    // Handle Ctrl/Cmd + V
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      navigator.clipboard.readText().then(text => this.handlePaste(text));
      return;
    }

    if (event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';
    this.handlePaste(clipboardData);
  }

  private handlePaste(data: string) {
    const digits = data.replace(/\D/g, '').slice(0, 6);
    const inputs = this.otpInputs.toArray();

    digits.split('').forEach((digit, i) => {
      if (inputs[i]) {
        inputs[i].nativeElement.value = digit;
        switch (i) {
          case 0: this.otp1 = digit; break;
          case 1: this.otp2 = digit; break;
          case 2: this.otp3 = digit; break;
          case 3: this.otp4 = digit; break;
          case 4: this.otp5 = digit; break;
          case 5: this.otp6 = digit; break;
        }
      }
    });

    if (digits.length < 6) {
      inputs[digits.length]?.nativeElement.focus();
    } else if (digits.length === 6) {
      this.verifyOtp();
    }
  }

  verifyOtp() {
    if (!this.otp || this.otp.length < 6) {
      window.alert('❌ Please enter the complete 6-digit OTP.');
      return;
    }

    this.sending = true;
    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: (success: boolean) => {
        this.sending = false;
        if (success) {
          const role = this.authService.getCurrentUserRole();
          this.router.navigate([role === 'ROLE_ADMIN' ? '/menu-admin' : '/menu-user']);
        } else {
          window.alert('❌ Invalid or expired OTP.');
        }
      },
      error: (err) => {
        this.sending = false;

        if (err.type === 'server') {
          window.alert('❌ Server error. Please try again later.');
        } else if (err.type === 'network') {
          window.alert('❌ Network unavailable. Check your connection.');
        } else {
          window.alert('❌ Unknown error occurred.');
        }

        console.error('OTP verification failed with error:', err);
      }
    });
  }

  resendOtp() {
    if (!this.email) {
      window.alert('❌ Email not found. Cannot resend OTP.');
      return;
    }

    this.sending = true;
    this.authService.requestOtp(this.email).subscribe({
      next: (res) => {
        this.sending = false;
        if (res?.success) {
          window.alert('✅ OTP resent successfully. Please check your email.');
          // Stay on the same page, do not navigate
        } else {
          window.alert(res?.message || '❌ Failed to resend OTP.');
        }
      },
      error: (err) => {
        this.sending = false;

        if (err.type === 'server') {
          window.alert('❌ Server error. Please try again later.');
        } else if (err.type === 'network') {
          window.alert('❌ Network unavailable. Check your connection.');
        } else {
          window.alert('❌ Unknown error occurred.');
        }

        console.error('OTP resend failed with error:', err);
      }
    });
  }
}
