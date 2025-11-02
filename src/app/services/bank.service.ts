import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BackendConfig} from '../config/backend-config';
import {BankDto} from '../dto/bank.dto';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private apiUrl = `${BackendConfig.springApiUrl}/banks`; // dynamically reference backend URL

  constructor(private http: HttpClient) {}

  getBanksByUserEmail(email: string): Observable<BankDto[]> {
    return this.http.get<BankDto[]>(`${this.apiUrl}?email=${email}`);
  }

}
