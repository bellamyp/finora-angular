import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { SignUp } from './components/sign-up/sign-up';

export const routes: Routes = [

  // Public routes
  { path: 'login', component: Login },
  { path: 'signup', component: SignUp },

  // Protected routes
  { path: 'home', component: Home, canActivate: [authGuard] },

  // Wildcard: redirect unmatched routes to login
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
