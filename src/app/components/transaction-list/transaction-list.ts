import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { LocationService } from '../../services/location.service';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';
import { LocationDto } from '../../dto/location.dto';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList implements OnInit {

  loading = true;
  transactionGroups: TransactionGroupDto[] = [];
  bankMap: Record<string, string> = {};
  brandMap: Record<string, string> = {};
  locationMap: Record<string, string> = {};

  constructor(
    private transactionGroupService: TransactionGroupService,
    private bankService: BankService,
    private brandService: BrandService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPostedTransactionGroups();
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

  fetchPostedTransactionGroups(): void {
    this.loading = true;

    forkJoin({
      banks: this.bankService.getBanks(),
      brands: this.brandService.getBrandsByUser(),
      locations: this.locationService.getLocations(),
      groups: this.transactionGroupService.getTransactionGroups('posted')
    }).subscribe({
      next: ({ banks, brands, locations, groups }) => {

        // Build lookup maps
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

        // Map bankName, brandName, locationName into transactions
        this.transactionGroups = groups.map(group => ({
          ...group,
          transactions: group.transactions.map(tx => ({
            ...tx,
            bankName: this.bankMap[tx.bankId] ?? tx.bankId,
            brandName: this.brandMap[tx.brandId] ?? tx.brandId,
            locationName: this.locationMap[tx.locationId] ?? tx.locationName
          }))
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch posted transaction groups:', err);
        this.loading = false;
      }
    });
  }

  openTransactionGroup(groupId: string) {
    this.router.navigate(['/transaction-view', groupId]);
  }
}
