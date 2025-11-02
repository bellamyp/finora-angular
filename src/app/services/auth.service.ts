import {Injectable} from '@angular/core';
import {BackendConfig} from '../config/backend-config';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;
  private apiUrl = `${BackendConfig.springApiUrl}/auth`; // dynamically reference backend URL

  constructor(private http: HttpClient) {
    // check if user is already logged in
    this.loggedIn = !!localStorage.getItem('user');
  }

  login(email: string, password: string): Observable<boolean> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.post<{email: string, role: string}>(`${this.apiUrl}/login`, null, { params })
      .pipe(
        map(res => {
          this.loggedIn = true;
          // save both email and role in localStorage
          localStorage.setItem('user', JSON.stringify({
            email: res.email,
            role: res.role
          }));
          return true;
        }),
        catchError(err => {
          this.loggedIn = false;
          return of(false);
        })
      );
  }

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
    const user = this.getCurrentUser();
    return user?.role ?? null;
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
