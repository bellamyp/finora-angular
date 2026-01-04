import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { ReportDto } from '../../dto/report.dto';

@Component({
  selector: 'app-report-list',
  imports: [CommonModule],
  templateUrl: './report-list.html',
  styleUrls: ['./report-list.scss'],
})
export class ReportList implements OnInit {

  reports: ReportDto[] = [];
  loading = true;
  error?: string;

  constructor(
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  private loadReports(): void {
    this.loading = true;
    this.reportService.getAllReports().subscribe({
      next: (reports) => {
        this.reports = reports;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load reports', err);
        this.error = 'Failed to load reports';
        this.loading = false;
      }
    });
  }

  // Navigate to the report view page
  viewReport(report: ReportDto): void {
    this.router.navigate(['/report-view', report.id]);
  }

  downloadReport(report: ReportDto): void {
    alert('This feature is not implemented yet');
  }
}
