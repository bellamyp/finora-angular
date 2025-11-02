import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { SignUp } from './components/sign-up/sign-up';
import {MenuAdmin} from './components/menu-admin/menu-admin';
import {MenuUser} from './components/menu-user/menu-user';

export const routes: Routes = [

  // Public routes
  { path: 'login', component: Login },
  { path: 'signup', component: SignUp },

  // Protected routes
  { path: 'menu-admin', component: MenuAdmin, canActivate: [authGuard] },
  { path: 'menu-user', component: MenuUser, canActivate: [authGuard] },

  // Wildcard: redirect unmatched routes to login
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
