import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { SignUp } from './components/sign-up/sign-up';
import { MenuAdmin } from './components/menu-admin/menu-admin';
import { MenuUser } from './components/menu-user/menu-user';
import { BankList } from './components/bank-list/bank-list';
import { BankCreate } from './components/bank-create/bank-create';
import { TransactionList } from './components/transaction-list/transaction-list';
import { LoginOtpRequest } from './components/login-otp-request/login-otp-request';
import { LoginOtpConfirm } from './components/login-otp-confirm/login-otp-confirm';
import { BrandCreate } from './components/brand-create/brand-create';
import { TransactionPendingList } from './components/transaction-pending-list/transaction-pending-list';
import { TransactionUpdate } from './components/transaction-update/transaction-update';
import { TransactionSearch } from './components/transaction-search/transaction-search';
import { TransactionView } from './components/transaction-view/transaction-view';
import { BankView } from './components/bank-view/bank-view';
import { TransactionRepeatList } from './components/transaction-repeat-list/transaction-repeat-list';
import {LocationCreate} from './components/location-create/location-create';

export const routes: Routes = [

  // Public routes
  { path: 'login', component: Login },
  { path: 'login-otp-request', component: LoginOtpRequest },
  { path: 'login-otp-confirm', component: LoginOtpConfirm },
  { path: 'signup', component: SignUp },

  // Protected routes
  { path: 'menu-admin', component: MenuAdmin, canActivate: [authGuard] },
  { path: 'menu-user', component: MenuUser, canActivate: [authGuard] },
  { path: 'transaction-list', component: TransactionList, canActivate: [authGuard] },
  { path: 'transaction-search', component: TransactionSearch, canActivate: [authGuard] },
  { path: 'transaction-pending-list', component: TransactionPendingList, canActivate: [authGuard] },
  { path: 'transaction-repeat-list', component: TransactionRepeatList, canActivate: [authGuard] },
  { path: 'transaction-update', component: TransactionUpdate, canActivate: [authGuard] }, // create
  { path: 'transaction-update/:groupId', component: TransactionUpdate, canActivate: [authGuard] }, // update
  { path: 'transaction-update/:groupId/repeat', component: TransactionUpdate, canActivate: [authGuard] }, // repeat
  { path: 'transaction-view/:groupId', component: TransactionView, canActivate: [authGuard] },
  { path: 'bank-list', component: BankList, canActivate: [authGuard] },
  { path: 'bank-view/:bankId', component: BankView, canActivate: [authGuard] },
  { path: 'bank-create', component: BankCreate, canActivate: [authGuard] },
  { path: 'brand-create', component: BrandCreate, canActivate: [authGuard] },
  { path: 'location-create', component: LocationCreate, canActivate: [authGuard] },

  // Wildcard: redirect unmatched routes to login page
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
