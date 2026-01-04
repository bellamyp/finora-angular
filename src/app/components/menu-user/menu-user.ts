import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ReportService} from '../../services/report.service';
import {ReportDto} from '../../dto/report.dto';

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.html',
  styleUrl: './menu-user.scss',
})
export class MenuUser implements OnInit {

  canGenerateReport = false;
  loadingReportCheck = true;

  constructor(
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.checkReportAvailability();
  }

  // --- Navigation Methods (Transactions) ---
  goToTransactionUpdate() {
    this.router.navigate(['/transaction-update']);
  }

  goToTransactionPendingList() {
    this.router.navigate(['/transaction-pending-list']);
  }

  goToTransactionSearch() {
    this.router.navigate(['/transaction-search']);
  }

  goToTransactionList() {
    this.router.navigate(['/transaction-list']);
  }

  goToTransactionRepeatList() {
    this.router.navigate(['/transaction-repeat-list']);
  }

  // --- Navigation Methods (Banks) ---
  goToBankList() {
    this.router.navigate(['/bank-list']);
  }

  goToBankCreate() {
    this.router.navigate(['/bank-create']);
  }

  // --- Reports ---
  newReport() {
    this.reportService.createNewReport().subscribe({
      next: (report: ReportDto) => {
        console.log('New report created:', report);
        // Navigate to the report view page, optionally passing the report ID
        this.router.navigate(['/report-view', report.id]);
      },
      error: (err) => {
        console.error('Failed to create new report', err);
        alert('Failed to create new report. See console for details.');
      }
    });
  }

  getNewReportButtonText(): string {
    if (this.loadingReportCheck) {
      return 'Checking Report Availability...';
    }

    if (!this.canGenerateReport) {
      return 'Cannot create new report (Pending)';
    }

    return 'Add a New Report';
  }

  viewReport() {
    this.router.navigate(['/report-list']);
  }

  customReport() {
    alert('Custom Report is not implemented yet.');
  }

  // --- Records ---
  activeRecords() {
    alert('Active Records is not implemented yet.');
  }

  addRecord() {
    alert('Add New Record is not implemented yet.');
  }

  oldRecords() {
    alert('Old Records is not implemented yet.');
  }

  private checkReportAvailability(): void {
    this.loadingReportCheck = true;
    this.reportService.canGenerateNewReport().subscribe({
      next: (canGenerate) => {
        this.canGenerateReport = canGenerate;
        this.loadingReportCheck = false;
      },
      error: (err) => {
        console.error('Failed to check report availability', err);
        this.canGenerateReport = false;
        this.loadingReportCheck = false;
      }
    });
  }
}
