import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BackendConfig} from '../config/backend-config';
import {BankDto} from '../dto/bank.dto';
import {BankDailyBalanceDto} from '../dto/bank-daily-balance.dto';
import {BankEditDto} from '../dto/bank-edit.dto';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private apiUrl = `${BackendConfig.springApiUrl}/banks`; // dynamically reference backend URL

  constructor(private http: HttpClient) {}

  // GET all banks
  getBanks(): Observable<BankDto[]> {
    return this.http.get<BankDto[]>(this.apiUrl);
  }

  // GET a single bank by ID (summary)
  getBankById(bankId: string): Observable<BankDto> {
    return this.http.get<BankDto>(`${this.apiUrl}/${bankId}`);
  }

  // GET a bank for edit (with openingDate/closingDate)
  getBankForEdit(bankId: string): Observable<BankEditDto> {
    return this.http.get<BankEditDto>(`${this.apiUrl}/${bankId}/edit`);
  }

  // GET last 30 days daily balance
  getDailyBalance(bankId: string): Observable<BankDailyBalanceDto[]> {
    return this.http.get<BankDailyBalanceDto[]>(`${this.apiUrl}/${bankId}/daily-balance`);
  }

  // CREATE new bank
  createBank(payload: BankEditDto): Observable<BankDto> {
    return this.http.post<BankDto>(this.apiUrl, payload);
  }

  // UPDATE existing bank
  updateBank(payload: BankEditDto): Observable<BankDto> {
    return this.http.put<BankDto>(this.apiUrl, payload);
  }

}
