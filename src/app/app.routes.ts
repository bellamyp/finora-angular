import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home , canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
