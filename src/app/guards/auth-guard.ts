import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Check if a user has a valid token
  if (auth.isLoggedIn()) {
    return true;
  }

  // Token missing or expired → show warning
  window.alert('⚠️ Your session has expired. Please log in again.');

  // Redirect to login page
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
