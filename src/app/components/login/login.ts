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
export class Login implements OnInit{

  email = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      const role = this.auth.getCurrentUserRole();
      if (role === 'ROLE_ADMIN') {
        this.router.navigate(['/menu-admin']);
      } else {
        this.router.navigate(['/menu-user']);
      }
    }
  }

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: success => {
        if (success) {
          // Get role from AuthService
          const role = this.auth.getCurrentUserRole();

          if (role === 'ROLE_ADMIN') {
            console.log('Redirect to Admin Menu');
            this.router.navigate(['/menu-admin']);
          } else {
            console.log('Redirect to User Menu');
            this.router.navigate(['/menu-user']);
          }
        } else {
          window.alert('❌ Login failed: Invalid email or password.');
        }
      },
      error: err => {
        console.error('Login error', err);
        window.alert('❌ Login failed: Network or server error.');
      }
    });
  }

  loginWithGithub() {
    // Show warning
    window.alert('⚠️ This button is not working yet.');
  }

  loginWithGoogle() {
    this.loginWithGithub();
  }

  loginWithFacebook() {
    this.loginWithGithub();
  }

  loginWithIcloud() {
    this.loginWithGithub();
  }
}
