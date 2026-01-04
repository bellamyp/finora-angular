// src/app/services/report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendConfig } from '../config/backend-config';
import { ReportDto } from '../dto/report.dto';
import {ReportTypeBalanceDto} from '../dto/report-type-balance.dto';
import {ReportBankBalanceDto} from '../dto/report-bank-balance.dto';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = `${BackendConfig.springApiUrl}/reports`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new report for the current user
   * POST /api/reports/new
   */
  createNewReport(): Observable<ReportDto> {
    return this.http.post<ReportDto>(`${this.apiUrl}/new`, {});
  }

  /**
   * Add all fully posted transaction groups to a report
   */
  addTransactionGroups(reportId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${reportId}/add-groups`, {});
  }

  /**
   * Remove the report from a transaction group
   */
  removeReportFromGroup(groupId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/groups/${groupId}/remove-report`, {});
  }

  /**
   * Get all reports for the current user
   * GET /api/reports
   */
  getAllReports(): Observable<ReportDto[]> {
    return this.http.get<ReportDto[]>(this.apiUrl);
  }

  /**
   * Get a single report by its ID
   * GET /api/reports/{reportId}
   */
  getReportById(reportId: string): Observable<ReportDto> {
    return this.http.get<ReportDto>(`${this.apiUrl}/${reportId}`);
  }

  /**
   * Get the next pending report for the current user
   * GET /api/reports/next-pending
   */
  getNextPendingReport(): Observable<ReportDto | null> {
    return this.http.get<ReportDto>(`${this.apiUrl}/next-pending`);
  }

  /**
   * Check if the user can generate a new report
   * GET /api/reports/can-generate
   */
  canGenerateNewReport(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/can-generate`);
  }

  /**
   * Check if the user has any pending reports
   * GET /api/reports/has-pending
   */
  hasPendingReport(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/has-pending`);
  }

  /**
   * Check if the user can add transaction groups to a report
   * GET /api/reports/can-add-groups
   */
  canAddTransactionGroups(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/can-add-groups`);
  }

  /**
   * Get type balances for a report
   * GET /api/reports/{reportId}/type-balances
   */
  getReportTypeBalances(reportId: string): Observable<ReportTypeBalanceDto[]> {
    return this.http.get<ReportTypeBalanceDto[]>(`${this.apiUrl}/${reportId}/type-balances`);
  }

  /**
   * Get bank balances for a report
   * GET /api/reports/{reportId}/bank-balances
   */
  getReportBankBalances(reportId: string): Observable<ReportBankBalanceDto[]> {
    return this.http.get<ReportBankBalanceDto[]>(`${this.apiUrl}/${reportId}/bank-balances`);
  }
}
