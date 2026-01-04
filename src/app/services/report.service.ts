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
   */
  createNewReport(): Observable<ReportDto> {
    return this.http.post<ReportDto>(`${this.apiUrl}/new`, {});
  }

  /**
   * Get all reports for the current user
   * GET /api/reports
   */
  getAllReports(): Observable<ReportDto[]> {
    return this.http.get<ReportDto[]>(this.apiUrl);
  }

  // New method to check if the user can create a report
  canGenerateNewReport(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/can-generate`);
  }
}
