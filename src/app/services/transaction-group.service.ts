import { Injectable } from '@angular/core';
import { BackendConfig } from '../config/backend-config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionGroupCreateDto } from '../dto/transaction-group-create.dto';
import { TransactionGroupDto } from '../dto/transaction-group.dto';

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
   */
  createTransactionGroup(payload: TransactionGroupCreateDto): Observable<TransactionGroupResponse> {
    return this.http.post<TransactionGroupResponse>(this.apiUrl, payload);
  }

  /**
   * Update an existing transaction group
   */
  updateTransactionGroup(payload: TransactionGroupDto) {
    return this.http.put<{ success: boolean; message: string }>(this.apiUrl, payload);
  }

  /**
   * Get transaction groups, optionally filtered by status.
   * Accepts 'posted' (default), 'pending', or 'repeat'.
   */
  getTransactionGroups(status: 'posted' | 'pending' | 'repeat' = 'posted'): Observable<TransactionGroupDto[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<TransactionGroupDto[]>(this.apiUrl, { params });
  }

  /**
   * Get a single transaction group by ID for the current user
   */
  getTransactionGroupById(groupId: string): Observable<TransactionGroupDto> {
    const url = `${this.apiUrl}/${groupId}`;
    return this.http.get<TransactionGroupDto>(url);
  }
}
