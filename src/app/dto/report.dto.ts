// src/app/dto/report.dto.ts
export interface ReportDto {
  id: string;
  userId: string;
  month: string; // ISO string e.g. "2025-12-01"
  posted: boolean;
}
