import { Injectable } from '@angular/core';
import {BackendConfig} from '../config/backend-config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TransactionGroupCreateDto} from '../dto/transaction-group-create.dto';
import {TransactionGroupDto} from '../dto/transaction-group.dto';

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

  /**
   * Get transaction groups, optionally filtered by status.
   * @param status 'posted' (default) or 'pending'
   */
  getTransactionGroups(status: 'posted' | 'pending' = 'posted'): Observable<TransactionGroupDto[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<TransactionGroupDto[]>(this.apiUrl, { params });
  }
}

