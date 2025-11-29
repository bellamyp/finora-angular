import { Injectable } from '@angular/core';
import {BackendConfig} from '../config/backend-config';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {BankGroupDto} from '../dto/bank-group.dto';
import {BankGroupCreateDto} from '../dto/bank-group-create.dto';

@Injectable({
  providedIn: 'root'
})
export class BankGroupService {

  private apiUrl = `${BackendConfig.springApiUrl}/bank-groups`;

  constructor(private http: HttpClient) {}

  /** GET all bank groups belonging to the current user */
  getBankGroups(): Observable<BankGroupDto[]> {
    return this.http.get<BankGroupDto[]>(this.apiUrl).pipe(
      map(groups => groups ?? []),
      catchError(err => {
        console.error('Failed to load bank groups:', err);
        return throwError(() => err);
      })
    );
  }

  /** POST create a new bank group */
  createBankGroup(payload: BankGroupCreateDto): Observable<BankGroupDto> {
    return this.http.post<BankGroupDto>(this.apiUrl, payload).pipe(
      map(group => group), // identity, but keeps pattern consistent
      catchError(err => {
        console.error('Failed to create bank group:', err);
        return throwError(() => err);
      })
    );
  }
}
