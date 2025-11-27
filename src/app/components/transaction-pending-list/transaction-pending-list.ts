import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionResponseDto } from '../../dto/transaction-group.dto';
import { TransactionService } from '../../services/transaction.service';
import { BankService } from '../../services/bank.service';
import { BrandService } from '../../services/brand.service';
import { forkJoin } from 'rxjs';
import { BankDto } from '../../dto/bank.dto';
import { BrandDto } from '../../dto/brand.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-pending-list',
  imports: [CommonModule],
  templateUrl: './transaction-pending-list.html',
  styleUrl: './transaction-pending-list.scss',
})
export class TransactionPendingList implements OnInit {

  loading = true;
  results: TransactionResponseDto[] = [];
  bankMap: Record<string, string> = {};
  brandMap: Record<string, string> = {};

  constructor(
    private transactionService: TransactionService,
    private bankService: BankService,
    private brandService: BrandService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPendingTransactions();
  }

  getAmountDisplay(tx: { amount: number | null }): { display: string; classes: any } {
    if (tx.amount === null) {
      return {
        display: '—',
        classes: {}
      };
    }

    return {
      display: `$${tx.amount.toFixed(2)}`,
      classes: {
        'text-success': tx.amount > 0,
        'text-danger': tx.amount < 0
      }
    };
  }

  openTransactionGroup(groupId: string) {
    this.router.navigate(['/transaction-update', groupId]);
  }

  fetchPendingTransactions(): void {
    this.loading = true;

    forkJoin({
      banks: this.bankService.getBanks(),
      brands: this.brandService.getBrandsByUser(),
      transactions: this.transactionService.getPendingTransactions()
    }).subscribe({
      next: ({ banks, brands, transactions }) => {

        // Build lookup maps
        this.bankMap = banks.reduce((map: Record<string, string>, bank: BankDto) => {
          map[bank.id] = bank.name;
          return map;
        }, {});

        this.brandMap = brands.reduce((map: Record<string, string>, brand: BrandDto) => {
          map[brand.id] = `${brand.name}`;
          return map;
        }, {});

        // Map bankName / brandName into transactions
        this.results = transactions.map(tx => ({
          ...tx,
          bankName: this.bankMap[tx.bankId] ?? tx.bankId,
          brandName: this.brandMap[tx.brandId] ?? tx.brandId,
          locationName: 'Mock Location' // <-- MOCK DATA
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch pending transactions:', err);
        this.loading = false;
      }
    });
  }

}
