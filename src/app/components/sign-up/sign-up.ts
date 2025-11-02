import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {

  signUpForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      // Collect which fields are invalid
      const errors: string[] = [];

      const nameCtrl = this.signUpForm.get('name');
      const emailCtrl = this.signUpForm.get('email');
      const passwordCtrl = this.signUpForm.get('password');

      if (nameCtrl?.invalid) {
        errors.push('Name is required');
      }
      if (emailCtrl?.invalid) {
        if (emailCtrl.errors?.['required']) {
          errors.push('Email is required');
        }
        if (emailCtrl.errors?.['email']) {
          errors.push('Email format is invalid');
        }
      }
      if (passwordCtrl?.invalid) {
        errors.push('Password is required');
      }

      // Show all errors in a single alert
      window.alert('❌ Sign-up failed:\n' + errors.join('\n'));
      return;
    }

    this.loading = true;

    const user = {
      name: this.signUpForm.value.name,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
      // role handled by backend (e.g., default USER role)
    };

    this.userService.createUser(user).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error || 'Sign-up failed';
      }
    });
  }
}
