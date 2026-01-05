import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { LocationService } from '../../services/location.service';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';
import { LocationDto } from '../../dto/location.dto';
import { forkJoin } from 'rxjs';
import { CommonModule, NgClass } from '@angular/common';
import { ReportService } from '../../services/report.service';
import {ReportTypeBalanceDto} from '../../dto/report-type-balance.dto';
import {ReportBankBalanceDto} from '../../dto/report-bank-balance.dto';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.html',
  styleUrl: './report-view.scss',
  imports: [NgClass, CommonModule]
})
export class ReportView implements OnInit {

  reportId!: string;
  reportPosted = false;
  reportTypeBalances: ReportTypeBalanceDto[] = [];
  reportBankBalances: ReportBankBalanceDto[] = [];
  currentReportMonth: string = '';

  loading = true;
  transactionGroups: TransactionGroupDto[] = [];
  canAddTransactionGroups = false;
  bankMap: Record<string, string> = {};
  brandMap: Record<string, string> = {};
  locationMap: Record<string, string> = {};

  constructor(
    private route: ActivatedRoute,
    private transactionGroupService: TransactionGroupService,
    private bankService: BankService,
    private brandService: BrandService,
    private locationService: LocationService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('id')!;
    this.loadReportData();
  }

  getAmountDisplay(tx: { amount: number | null }): { display: string; classes: any } {
    if (tx.amount === null) return { display: '—', classes: {} };

    return {
      display: `$${tx.amount.toFixed(2)}`,
      classes: {
        'text-success': tx.amount > 0,
        'text-danger': tx.amount < 0
      }
    };
  }

  getPostButtonText(): string {
    return this.reportPosted ? 'Report Posted' : 'Post this Report';
  }

  getLoadTransactionsText(): string {
    return this.canAddTransactionGroups ? 'Load all available transactions' : 'No fully posted transactions to add';
  }

  addTransactionGroupsToReport(): void {
    if (!this.reportId) return;

    this.reportService.addTransactionGroups(this.reportId).subscribe({
      next: () => {
        alert('All fully posted transaction groups have been added to this report.');
        this.loadReportData();
      },
      error: (err) => {
        console.error('Failed to add transaction groups', err);
        alert('Failed to add transaction groups. See console for details.');
      }
    });
  }

  removeGroupFromReport(group: TransactionGroupDto): void {
    if (!group.id) return;

    if (this.reportPosted) {
      alert('Cannot remove a group from a posted report.');
      return;
    }

    const confirmed = confirm(`Are you sure you want to remove group ${group.id} from this report?`);
    if (!confirmed) return;

    this.reportService.removeReportFromGroup(group.id).subscribe({
      next: () => {
        this.loadReportData();
      },
      error: (err) => {
        console.error('Failed to remove group from report:', err);
        alert('Failed to remove group from report. See console for details.');
      }
    });
  }

  postReport(): void {
    if (!this.reportId) return;

    const confirmed = confirm('Are you sure you want to post this report? Once posted, it cannot be modified.');
    if (!confirmed) return;

    this.reportService.postReport(this.reportId).subscribe({
      next: (postedReport) => {
        alert('Report has been successfully posted!');
        this.reportPosted = postedReport.posted; // mark as posted
        this.loadReportData(); // refresh balances and groups
      },
      error: (err) => {
        console.error('Failed to post report', err);
        alert('Failed to post report. See console for details.');
      }
    });
  }

  // -----------------------
  // Reload everything from BE
  // -----------------------
  private loadReportData(): void {
    this.loadReportGroups();
    this.checkCanAddTransactionGroups();
    this.loadReportStatus();
    this.loadReportTypeBalances();
    this.loadReportBankBalances();
  }

  // -----------------------
  // Load report transaction groups
  // -----------------------
  private loadReportGroups(): void {
    this.loading = true;

    forkJoin({
      banks: this.bankService.getBanks(),
      brands: this.brandService.getBrandsByUser(),
      locations: this.locationService.getLocations(),
      groups: this.transactionGroupService.getTransactionGroupsByReport(this.reportId)
    }).subscribe({
      next: ({ banks, brands, locations, groups }) => {
        this.bankMap = banks.reduce((map: Record<string, string>, bank: BankDto) => {
          map[bank.id] = bank.name;
          return map;
        }, {});

        this.brandMap = brands.reduce((map: Record<string, string>, brand: BrandDto) => {
          map[brand.id] = brand.name;
          return map;
        }, {});

        this.locationMap = locations.reduce((map: Record<string, string>, loc: LocationDto) => {
          map[loc.id] = `${loc.city}, ${loc.state}`;
          return map;
        }, {});

        // Map names into transactions
        this.transactionGroups = groups.map(group => ({
          ...group,
          transactions: group.transactions.map(tx => ({
            ...tx,
            bankName: this.bankMap[tx.bankId] ?? tx.bankId,
            brandName: this.brandMap[tx.brandId] ?? tx.brandId,
            locationName: this.locationMap[tx.locationId] ?? tx.locationId
          }))
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch report groups:', err);
        this.loading = false;
      }
    });
  }

  // -----------------------
  // Check if user can add groups
  // -----------------------
  private checkCanAddTransactionGroups(): void {
    this.reportService.canAddTransactionGroups().subscribe({
      next: (canAdd) => this.canAddTransactionGroups = canAdd,
      error: () => this.canAddTransactionGroups = false
    });
  }

  // -----------------------
  // Load report posted status
  // -----------------------
  private loadReportStatus(): void {
    this.reportService.getReportById(this.reportId).subscribe({
      next: (report) => {
        this.reportPosted = report.posted;

        if (report.month) {
          const [year, month] = report.month.split('-');
          const monthName = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long' });
          this.currentReportMonth = `${year} / ${monthName}`;
          console.log('currentReportMonth:', this.currentReportMonth);
        }
      },
      error: () => {
        this.reportPosted = false;
        this.currentReportMonth = '';
      }
    });
  }

  private loadReportTypeBalances(): void {
    if (!this.reportId) return;

    this.reportService.getReportTypeBalances(this.reportId).subscribe({
      next: (balances) => {
        // Optional: sort by typeId or type name if needed
        this.reportTypeBalances = balances.sort((a, b) =>
          a.typeId.localeCompare(b.typeId)
        );
      },
      error: (err) => {
        console.error('Failed to load report type balances:', err);
        this.reportTypeBalances = [];
      }
    });
  }

  private loadReportBankBalances(): void {
    if (!this.reportId) return;

    this.reportService.getReportBankBalances(this.reportId).subscribe({
      next: (balances) => {
        // Optional: sort by bankId if needed
        this.reportBankBalances = balances;
      },
      error: (err) => {
        console.error('Failed to load report bank balances:', err);
        this.reportBankBalances = [];
      }
    });
  }
}
