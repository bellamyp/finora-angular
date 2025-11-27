import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { forkJoin } from 'rxjs';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';
import {TransactionGroupRepeatService} from '../../services/transaction-group-repeat.service';

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

  constructor(
    private transactionGroupService: TransactionGroupService,
    private transactionGroupRepeatService: TransactionGroupRepeatService,
    private bankService: BankService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.fetchRepeatTransactionGroups();
  }

  fetchRepeatTransactionGroups(): void {
    this.loading = true;

    forkJoin({
      banks: this.bankService.getBanks(),
      brands: this.brandService.getBrandsByUser(),
      groups: this.transactionGroupService.getTransactionGroups('repeat')
    }).subscribe({
      next: ({ banks, brands, groups }) => {

        // Build bank map
        this.bankMap = banks.reduce((map: Record<string, string>, bank: BankDto) => {
          map[bank.id] = bank.name;
          return map;
        }, {});

        // Build brand map
        this.brandMap = brands.reduce((map: Record<string, string>, brand: BrandDto) => {
          map[brand.id] = `${brand.name}`;
          return map;
        }, {});

        // Add bankName and brandName to each transaction
        this.transactionGroups = groups.map(group => ({
          ...group,
          transactions: group.transactions.map(tx => ({
            ...tx,
            bankName: this.bankMap[tx.bankId] ?? tx.bankId,
            brandName: this.brandMap[tx.brandId] ?? tx.brandId
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
    window.alert(`MOCK Repeat group clicked: ${groupId}`);
  }

  removeRepeatTag(groupId: string) {
    if (!groupId) return;

    // Show loading and clear current list
    this.loading = true;
    this.transactionGroups = [];

    this.transactionGroupRepeatService.removeRepeat(groupId).subscribe({
      next: () => {
        // After deletion, fetch the updated list
        this.fetchRepeatTransactionGroups();
      },
      error: (err) => {
        console.error(err);
        window.alert(`Failed to remove repeat tag: ${err.error || err.message}`);
        // Stop loading even if error occurs
        this.loading = false;
      }
    });
  }
}
