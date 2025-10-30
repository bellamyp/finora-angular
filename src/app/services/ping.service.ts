import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import {BackendConfig} from '../config/backend-config';

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private apiUrl = `${BackendConfig.springApiUrl}`;

  constructor(private http: HttpClient) {}

  ping() {
    return this.http.get(`${this.apiUrl}/ping`, { responseType: 'text' })
      .pipe(
        catchError(() => of('backend down'))
      );
  }
}
