import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BackendConfig} from '../config/backend-config';
import {BankDto} from '../dto/bank.dto';
import {BankCreateDto} from '../dto/bank-create.dto';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private apiUrl = `${BackendConfig.springApiUrl}/banks`; // dynamically reference backend URL

  constructor(private http: HttpClient) {}

  getBanks(): Observable<BankDto[]> {
    return this.http.get<BankDto[]>(this.apiUrl);
  }

  createBank(payload: BankCreateDto): Observable<BankDto> {
    return this.http.post<BankDto>(this.apiUrl, payload);
  }

}
