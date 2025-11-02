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

    return this.http.post(`${this.apiUrl}/login`, null, {params, responseType: 'text'})
      .pipe(
        map(res => {
          this.loggedIn = true;
          localStorage.setItem('user', JSON.stringify({email}));
          return true;
        }),
        catchError(err => {
          this.loggedIn = false;
          return of(false);
        })
      );
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
