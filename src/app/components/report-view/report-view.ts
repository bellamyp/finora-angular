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
import {CommonModule, NgClass} from '@angular/common';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.html',
  styleUrl: './report-view.scss',
  imports: [
    NgClass, CommonModule
  ]
})
export class ReportView implements OnInit {

  reportId!: string;
  loading = true;
  transactionGroups: TransactionGroupDto[] = [];
  bankMap: Record<string, string> = {};
  brandMap: Record<string, string> = {};
  locationMap: Record<string, string> = {};

  constructor(
    private route: ActivatedRoute,
    private transactionGroupService: TransactionGroupService,
    private bankService: BankService,
    private brandService: BrandService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('id')!;
    this.loadReportGroups();
  }

  getAmountDisplay(tx: { amount: number | null }): { display: string; classes: any } {
    if (tx.amount === null) {
      return { display: '—', classes: {} };
    }

    return {
      display: `$${tx.amount.toFixed(2)}`,
      classes: {
        'text-success': tx.amount > 0,
        'text-danger': tx.amount < 0
      }
    };
  }

  loadAllTransactions(): void {
    alert('Load all available transactions is not implemented yet!');
  }

  postReport(): void {
    alert('Post this report is not implemented yet!');
  }

  loadReportGroups(): void {
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

}
