import {Component, OnInit} from '@angular/core';
import {ReportService} from '../../services/report.service';
import {ReportDto} from '../../dto/report.dto';

@Component({
  selector: 'app-report-list',
  imports: [],
  templateUrl: './report-list.html',
  styleUrl: './report-list.scss',
})
export class ReportList implements OnInit {

  reports: ReportDto[] = [];
  loading = true;
  error?: string;

  constructor(
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
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

}
