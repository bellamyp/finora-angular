import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { TransactionGroupRepeatService } from '../../services/transaction-group-repeat.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { LocationService } from '../../services/location.service';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';
import { LocationDto } from '../../dto/location.dto';
import { forkJoin } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-transaction-repeat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-repeat-list.html',
  styleUrls: ['./transaction-repeat-list.scss'],
})
export class TransactionRepeatList implements OnInit {

  loading = true;
  transactionGroups: TransactionGroupDto[] = [];
  bankMap: Record<string, string> = {};
  brandMap: Record<string, string> = {};
  locationMap: Record<string, string> = {};

  constructor(
    private transactionGroupService: TransactionGroupService,
    private transactionGroupRepeatService: TransactionGroupRepeatService,
    private bankService: BankService,
    private brandService: BrandService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRepeatTransactionGroups();
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

  fetchRepeatTransactionGroups(): void {
    this.loading = true;

    forkJoin({
      banks: this.bankService.getBanks(),
      brands: this.brandService.getBrandsByUser(),
      locations: this.locationService.getLocations(),
      groups: this.transactionGroupService.getTransactionGroups('repeat')
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

        // Map bankName, brandName, locationName into each transaction
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
        console.error('Failed to fetch repeat transaction groups:', err);
        this.loading = false;
      }
    });
  }

  repeatGroup(groupId: string) {
    if (!groupId) {
      window.alert('Invalid group ID');
      return;
    }
    this.router.navigate(['/transaction-update', groupId, 'repeat']);
  }

  removeRepeatTag(groupId: string) {
    if (!groupId) return;

    this.loading = true;
    this.transactionGroups = [];

    this.transactionGroupRepeatService.removeRepeat(groupId).subscribe({
      next: () => this.fetchRepeatTransactionGroups(),
      error: (err) => {
        console.error(err);
        window.alert(`Failed to remove repeat tag: ${err.error || err.message}`);
        this.loading = false;
      }
    });
  }
}
