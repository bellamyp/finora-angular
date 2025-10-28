import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;

  constructor() {
    // check if user is already logged in
    this.loggedIn = !!localStorage.getItem('user');
  }

  login(email: string, password: string): boolean {
    // For now, hard coded test/test
    if (email === 'test' && password === 'test') {
    this.loggedIn = true;
    localStorage.setItem('user', JSON.stringify({ email }));
    return true;
  } else {
    this.loggedIn = false;
    return false;
  }
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
  
}
