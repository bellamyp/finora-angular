import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink
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
      this.router.navigate(['/home']);
    }
  }

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: success => {
        if (success) {
          this.router.navigate(['/home']);
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
