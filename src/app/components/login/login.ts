import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}
  login() {
    const success = this.auth.login(this.email, this.password);

    if (success) {
      this.router.navigate(['/home']);
    } else {
      // Simple feedback to user
      window.alert('❌ Login failed: Invalid email or password.');
    }
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
