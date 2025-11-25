import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendConfig } from '../config/backend-config';
import {TransactionGroupDto} from '../dto/transaction-group.dto';

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
  markAsRepeat(groupId: string): Observable<TransactionGroupDto> {
    return this.http.post<TransactionGroupDto>(`${this.apiUrl}/${groupId}`, {});
  }

  /**
   * Checks whether a transaction group is marked as repeat.
   * @param groupId The ID of the transaction group
   * @returns Observable<boolean>
   */
  isRepeat(groupId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${groupId}/is-repeat`);
  }

}
