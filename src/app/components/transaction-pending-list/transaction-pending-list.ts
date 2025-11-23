import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { TransactionGroupService } from '../../services/transaction-group.service';
import {BankService} from '../../services/bank.service';
import {forkJoin} from 'rxjs';
import {BankDto} from '../../dto/bank.dto';

@Component({
  selector: 'app-transaction-pending-list',
  imports: [CommonModule],
  templateUrl: './transaction-pending-list.html',
  styleUrl: './transaction-pending-list.scss',
})
export class TransactionPendingList implements OnInit {

  loading = true;
  transactionGroups: TransactionGroupDto[] = [];
  // bankId -> bankName mapping
  bankMap: Record<string, string> = {};

  constructor(
    private transactionGroupService: TransactionGroupService,
    private bankService: BankService
  ) {}

  ngOnInit(): void {
    this.fetchPendingTransactionGroups();
  }

  /**
   * Fetch pending transaction groups only
   */
  fetchPendingTransactionGroups(): void {
    this.loading = true;

    // load banks + groups at same time
    forkJoin({
      banks: this.bankService.getBanks(),
      groups: this.transactionGroupService.getTransactionGroups('pending')
    }).subscribe({
      next: ({ banks, groups }) => {

        // Build map: { bankId → bankName }
        this.bankMap = banks.reduce((map: Record<string, string>, bank: BankDto) => {
          map[bank.id] = bank.name;
          return map;
        }, {});

        // Map bankName into each transaction
        this.transactionGroups = groups.map(group => ({
          ...group,
          transactions: group.transactions.map(tx => ({
            ...tx,
            bankName: this.bankMap[tx.bankId] ?? tx.bankId
          }))
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch pending transaction groups:', err);
        this.loading = false;
      }
    });
  }
}
