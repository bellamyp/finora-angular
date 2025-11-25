import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  email = '';
  password = '';
  loading = false; // Prevent multiple clicks

  constructor(
    private auth: AuthService,
    private router: Router) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.redirectByRole();
    }
  }

  login() {
    if (!this.email || !this.password) {
      window.alert('⚠️ Please enter both email and password.');
      return;
    }

    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: success => {
        this.loading = false;
        if (success) {
          this.redirectByRole();
        } else {
          // 401 Unauthorized
          window.alert('❌ Login failed: Invalid email or password.');
        }
      },
      error: err => {
        this.loading = false;

        // Match the structure returned by AuthService.login()
        if (err.type === 'server') {
          window.alert('❌ Login failed: Server error. Please try again later.');
        } else if (err.type === 'network') {
          window.alert('❌ Login failed: Network unavailable. Check your connection.');
        } else {
          window.alert('❌ Login failed: Unknown error.');
        }

        console.error('Login error:', err);
      }
    });
  }

  redirectByRole() {
    const role = this.auth.getCurrentUserRole();
    if (role === 'ROLE_ADMIN') {
      console.log('Redirect to Admin Menu');
      this.router.navigate(['/menu-admin']);
    } else {
      console.log('Redirect to User Menu');
      this.router.navigate(['/menu-user']);
    }
  }
}
