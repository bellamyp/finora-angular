import { Injectable } from '@angular/core';
import {BackendConfig} from '../config/backend-config';
import {Observable} from 'rxjs';
import {TransactionResponseDto} from '../dto/transaction-group.dto';
import {HttpClient} from '@angular/common/http';
import {TransactionSearchDto} from '../dto/transaction-search.dto';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = `${BackendConfig.springApiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  /**
   * Search transactions using filters from FE
   * @param payload TransactionSearchDto
   */
  searchTransactions(payload: TransactionSearchDto): Observable<TransactionResponseDto[]> {
    const url = `${this.apiUrl}/search`;
    return this.http.post<TransactionResponseDto[]>(url, payload);
  }

  /**
   * Fetch all pending transactions for the current user
   */
  getPendingTransactions(): Observable<TransactionResponseDto[]> {
    const url = `${this.apiUrl}/pending`;
    return this.http.get<TransactionResponseDto[]>(url);
  }
}
