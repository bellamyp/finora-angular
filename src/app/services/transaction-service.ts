import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BackendConfig} from '../config/backend-config';
import {TransactionDto} from '../dto/transaction.dto';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = `${BackendConfig.springApiUrl}/transactions`; // dynamically reference backend URL

  constructor(private http: HttpClient) {}

  getTransactionsByEmail(email: string): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`${this.apiUrl}?email=${email}`);
  }
}
