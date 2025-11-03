import {Component, OnInit} from '@angular/core';
import {TransactionDto} from '../../dto/transaction.dto';
import {TransactionService} from '../../services/transaction-service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionList implements OnInit {

  transactions: TransactionDto[] = [];
  userEmail: string | null = null;
  loading = true;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {

    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userEmail = user.email;
      } catch {
        console.error('Invalid user data in localStorage');
      }
    }

    if (this.userEmail) {
      this.transactionService.getTransactionsByEmail(this.userEmail).subscribe({
        next: (data) => {
          this.transactions = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch transactions:', err);
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
      console.warn('No user email found in localStorage.');
    }
  }
}
