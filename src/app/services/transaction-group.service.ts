import { Injectable } from '@angular/core';
import {BackendConfig} from '../config/backend-config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TransactionGroupCreateDto} from '../dto/transaction-group-create.dto';

interface TransactionGroupResponse {
  success: boolean;
  groupId: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionGroupService {

  private apiUrl = `${BackendConfig.springApiUrl}/transaction-groups`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new transaction group
   * @param payload TransactionGroupCreateDto from FE
   */
  createTransactionGroup(payload: TransactionGroupCreateDto): Observable<TransactionGroupResponse> {
    return this.http.post<TransactionGroupResponse>(this.apiUrl, payload);
  }
}

