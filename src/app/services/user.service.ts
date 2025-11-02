import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../dto/user.dto';
import { BackendConfig } from '../config/backend-config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${BackendConfig.springApiUrl}/users`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl);
  }

  // ✅ POST /api/users
  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user, { responseType: 'text' });
    // responseType: 'text' to match backend returning plain String
  }

}
