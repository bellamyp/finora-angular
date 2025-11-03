import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { SignUp } from './components/sign-up/sign-up';
import {MenuAdmin} from './components/menu-admin/menu-admin';
import {MenuUser} from './components/menu-user/menu-user';
import {BankList} from './components/bank-list/bank-list';
import {BankCreate} from './components/bank-create/bank-create';
import {TransactionList} from './components/transaction-list/transaction-list';
import {TransactionCreate} from './components/transaction-create/transaction-create';

export const routes: Routes = [

  // Public routes
  { path: 'login', component: Login },
  { path: 'signup', component: SignUp },

  // Protected routes
  { path: 'menu-admin', component: MenuAdmin, canActivate: [authGuard] },
  { path: 'menu-user', component: MenuUser, canActivate: [authGuard] },
  { path: 'transaction-list', component: TransactionList, canActivate: [authGuard] },
  { path: 'transaction-create', component: TransactionCreate, canActivate: [authGuard] },
  { path: 'bank-list', component: BankList, canActivate: [authGuard] },
  { path: 'bank-create', component: BankCreate, canActivate: [authGuard] },

  // Wildcard: redirect unmatched routes to login
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
