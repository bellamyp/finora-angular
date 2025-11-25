import { Injectable } from '@angular/core';
import { BackendConfig } from '../config/backend-config';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string; // email
  exp: number; // expiration timestamp
  userId: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${BackendConfig.springApiUrl}/auth`; // backend URL

  constructor(private http: HttpClient) {
    // auto logout if token expired on service init
    this.checkTokenValid();
  }

  /** Password login */
  login(email: string, password: string): Observable<boolean> {
    const params = new HttpParams().set('email', email).set('password', password);

    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, null, { params })
      .pipe(
        map(res => {
          if (res.token) {
            this.storeToken(res.token);
            return true;
          }
          return false;
        }),
        catchError(err => {
          this.logout();

          if (err.status === 401) {
            return of(false); // wrong credentials
          }

          if (err.status >= 400) {
            return throwError(() => ({ type: 'server', error: err })); // server error
          }

          return throwError(() => ({ type: 'network', error: err })); // network error
        })
      );
  }

  /** Request OTP */
  requestOtp(email: string): Observable<{ success: boolean; message: string }> {
    const params = new HttpParams().set('email', email);
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/login/otp/request`,
      null,
      { params }
    ).pipe(
      catchError(err => {
        console.error('OTP request error:', err);

        // Backend/server error
        if (err.status >= 400) return throwError(() => ({ type: 'server', error: err }));
        // Network error / no response
        return throwError(() => ({ type: 'network', error: err }));
      })
    );
  }

  /** Verify OTP */
  verifyOtp(email: string, otp: string): Observable<boolean> {
    const params = new HttpParams().set('email', email).set('otp', otp);
    return this.http.post<{ success: boolean, message: string, token?: string }>(
      `${this.apiUrl}/login/otp/verify`,
      null,
      { params }
    ).pipe(
      map(res => {
        if (res.success && res.token) {
          this.storeToken(res.token);
          return true;
        }
        console.warn('OTP verification failed:', res.message);
        return false;
      }),
      catchError(err => {
        console.error('OTP verify error:', err);
        this.logout();

        // Distinguish server vs network errors
        if (err.status >= 400) return throwError(() => ({ type: 'server', error: err }));
        return throwError(() => ({ type: 'network', error: err }));
      })
    );
  }

  /** Store token in localStorage */
  private storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  /** Get stored token */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Decode JWT payload */
  private getTokenPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  /** Check if token is valid, auto logout if expired */
  private checkTokenValid(): boolean {
    const payload = this.getTokenPayload();
    if (!payload) {
      this.logout();
      return false;
    }
    const expired = payload.exp * 1000 < Date.now();
    if (expired) this.logout();
    return !expired;
  }

  /** Get current user info from token */
  getCurrentUser(): { email: string, role: string, userId: string } | null {
    const payload = this.getTokenPayload();
    if (!payload) return null;
    return { email: payload.sub, role: payload.role, userId: payload.userId };
  }

  /** Get current user role */
  getCurrentUserRole(): string | null {
    return this.getCurrentUser()?.role ?? null;
  }

  /** Get current user id */
  getCurrentUserId(): string | null {
    return this.getCurrentUser()?.userId ?? null;
  }

  /** Logout user */
  logout() {
    localStorage.removeItem('token');
  }

  /** Check if a user is logged in */
  isLoggedIn(): boolean {
    return this.checkTokenValid();
  }
}
