import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

interface BankOption { id: string; name: string; }
interface TransactionTypeOption { id: string; name: string; }
interface BrandOption { id: string; name: string; location: string; }
interface TransactionRow {
  date: string;
  amount: number | null;
  bankId?: string;
  brandId?: string;
  typeId?: string;
  notes: string;
  posted?: boolean; // mock posted status
}

@Component({
  selector: 'app-transaction-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-update.html',
  styleUrls: ['./transaction-update.scss']
})
export class TransactionUpdate implements OnInit {

  groupId = 'GRP-001'; // just for display

  banks: BankOption[] = [
    { id: 'B1', name: 'Bank A' },
    { id: 'B2', name: 'Bank B' }
  ];
  brands: BrandOption[] = [
    { id: 'BR-1', name: 'Brand One', location: 'NY' },
    { id: 'BR-2', name: 'Brand Two', location: 'CA' }
  ];
  transactionTypes: TransactionTypeOption[] = [
    { id: 'INCOME', name: 'Income' },
    { id: 'EXPENSE', name: 'Expense' }
  ];

  transactions: TransactionRow[] = [
    { date: '2025-11-20', amount: 100, bankId: 'B1', brandId: 'BR-1', typeId: 'INCOME', notes: 'Payment received', posted: false },
    { date: '2025-11-21', amount: -50, bankId: 'B2', brandId: 'BR-2', typeId: 'EXPENSE', notes: 'Office supplies', posted: false }
  ];

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('groupId') || '';
    console.log('Transaction Update Component initialized with groupId:', this.groupId);
  }

  // -------------------------------
  // Row-level actions
  // -------------------------------
  addTransaction() {
    this.transactions.push({ date: '', amount: null, bankId: undefined, brandId: undefined, typeId: undefined, notes: '', posted: false });
  }

  deleteTransaction(tx: TransactionRow, index: number) {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      this.transactions.splice(index, 1);
    }
  }

  markAsPosted(tx: TransactionRow) {
    tx.posted = true; // mock marking as posted
    window.alert(`Transaction on ${tx.date} marked as posted!`);
  }

  // -------------------------------
  // Bottom-level actions
  // -------------------------------
  submitAll() {
    console.log('Submitting all transactions:', this.transactions);
    window.alert('All transactions submitted (mock)!');
  }

  cancel() {
    if (window.confirm('Discard all changes?')) {
      window.alert('Changes discarded (mock)');
      // Optional: reload original transactions if needed
    }
  }

  goBack() {
    window.alert('Going back to previous page (mock)');
    // Optional: router.navigate(['/previous-page']);
  }
}
