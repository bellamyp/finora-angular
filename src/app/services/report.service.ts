// src/app/services/report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendConfig } from '../config/backend-config';
import { ReportDto } from '../dto/report.dto';

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
   * Get all reports for the current user
   * GET /api/reports
   */
  getAllReports(): Observable<ReportDto[]> {
    return this.http.get<ReportDto[]>(this.apiUrl);
  }

  /**
   * Check if the user can generate a new report
   * GET /api/reports/can-generate
   */
  canGenerateNewReport(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/can-generate`);
  }

  /**
   * Check if the user can add transaction groups to a report
   * GET /api/reports/can-add-groups
   */
  canAddTransactionGroups(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/can-add-groups`);
  }
}
