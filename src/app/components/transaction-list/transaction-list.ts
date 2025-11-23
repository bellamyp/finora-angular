import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionGroupDto} from '../../dto/transaction-group.dto';
import {TransactionGroupService} from '../../services/transaction-group.service';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList implements OnInit {

  transactionGroups: TransactionGroupDto[] = [];
  loading = true;

  constructor(private transactionGroupService: TransactionGroupService) {}

  ngOnInit(): void {
    this.transactionGroupService.getTransactionGroups().subscribe({
      next: (groups) => {
        this.transactionGroups = groups;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch transaction groups:', err);
        this.loading = false;
      }
    });
  }
}
