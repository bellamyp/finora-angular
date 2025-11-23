import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionGroupDto } from '../../dto/transaction-group.dto';
import { TransactionGroupService } from '../../services/transaction-group.service';

@Component({
  selector: 'app-transaction-pending-list',
  imports: [CommonModule],
  templateUrl: './transaction-pending-list.html',
  styleUrl: './transaction-pending-list.scss',
})
export class TransactionPendingList implements OnInit {

  transactionGroups: TransactionGroupDto[] = [];
  loading = true;

  constructor(private transactionGroupService: TransactionGroupService) {}

  ngOnInit(): void {
    this.fetchPendingTransactionGroups();
  }

  /**
   * Fetch pending transaction groups only
   */
  fetchPendingTransactionGroups(): void {
    this.loading = true;
    this.transactionGroupService.getTransactionGroups('pending').subscribe({
      next: (groups) => {
        this.transactionGroups = groups;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch pending transaction groups:', err);
        this.loading = false;
      }
    });
  }
}
