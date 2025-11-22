import { Injectable } from '@angular/core';
import { BackendConfig } from '../config/backend-config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import {UserDTO} from '../dto/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;
  private apiUrl = `${BackendConfig.springApiUrl}/auth`; // backend URL

  constructor(private http: HttpClient) {
    this.loggedIn = !!localStorage.getItem('user');
  }

  /** Password login */
  login(email: string, password: string): Observable<boolean> {
    const params = new HttpParams().set('email', email).set('password', password);

    return this.http.post<{ email: string, role: string }>(`${this.apiUrl}/login`, null, { params })
      .pipe(
        map(res => {
          this.loggedIn = true;
          localStorage.setItem('user', JSON.stringify(res));
          return true;
        }),
        catchError(err => {
          this.loggedIn = false;
          return of(false);
        })
      );
  }

  /** Request OTP to be sent to email */
  requestOtp(email: string): Observable<{ success: boolean; message: string } | null> {
    const params = new HttpParams().set('email', email);
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/login/otp/request`, null, { params })
      .pipe(
        catchError(err => {
          console.error('OTP request error:', err);
          return of(null);
        })
      );
  }

  /** Verify OTP for email login */
  verifyOtp(email: string, otp: string): Observable<UserDTO | null> {
    const params = new HttpParams().set('email', email).set('otp', otp);
    return this.http.post<{ success: boolean, message: string, data?: UserDTO }>(
      `${this.apiUrl}/login/otp/verify`, null, { params })
      .pipe(
        map(res => {
          if (res.success && res.data) {
            // ✅ Save user and mark logged in
            this.loggedIn = true;
            localStorage.setItem('user', JSON.stringify(res.data));
            return res.data;
          }
          console.warn('OTP verification failed:', res.message);
          return null;
        }),
        catchError(err => {
          console.error('OTP verify error:', err);
          return of(null);
        })
      );
  }

  /** Current logged-in user info */
  getCurrentUser(): { email: string, role: string } | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  getCurrentUserRole(): string | null {
    return this.getCurrentUser()?.role ?? null;
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
