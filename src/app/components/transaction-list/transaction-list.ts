import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionGroupDto} from '../../dto/transaction-group.dto';
import {TransactionGroupService} from '../../services/transaction-group.service';
import {BankService} from '../../services/bank.service';
import {forkJoin} from 'rxjs';
import {BankDto} from '../../dto/bank.dto';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList implements OnInit {

  loading = true;
  transactionGroups: TransactionGroupDto[] = [];
  // bankId -> bankName mapping
  bankMap: Record<string, string> = {};

  constructor(
    private transactionGroupService: TransactionGroupService,
    private bankService: BankService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    // load banks + groups at same time
    forkJoin({
      banks: this.bankService.getBanks(),
      groups: this.transactionGroupService.getTransactionGroups('posted')
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
        console.error('Failed to fetch posted transaction groups:', err);
        this.loading = false;
      }
    });
  }
}
