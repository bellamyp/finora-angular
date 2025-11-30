import {Component, OnInit} from '@angular/core';
import {ReportDto} from '../../dto/report.dto';
import {ActivatedRoute} from '@angular/router';
import {ReportService} from '../../services/report.service';

@Component({
  selector: 'app-report-view',
  imports: [],
  templateUrl: './report-view.html',
  styleUrl: './report-view.scss',
})
export class ReportView implements OnInit {

  reportId!: string;
  report?: ReportDto;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.reportId = this.route.snapshot.paramMap.get('id')!;
    this.loadReport();
  }

  loadReport() {
    // Optional: you can implement a "getReportById" service method if needed
    console.log('Report ID to load:', this.reportId);
  }

}
