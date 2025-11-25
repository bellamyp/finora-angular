import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendConfig } from '../config/backend-config';

@Injectable({
  providedIn: 'root'
})
export class TransactionGroupRepeatService {

  private apiUrl = `${BackendConfig.springApiUrl}/repeat-groups`;

  constructor(private http: HttpClient) { }

  /**
   * Marks a transaction group as repeat.
   * @param groupId The ID of the transaction group
   * @returns Observable of the repeat group
   */
  markAsRepeat(groupId: string): Observable<RepeatTransactionGroupDto> {
    return this.http.post<RepeatTransactionGroupDto>(`${this.apiUrl}/${groupId}`, {});
  }
}
