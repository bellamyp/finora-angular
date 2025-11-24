import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
}

@Component({
  selector: 'app-transaction-update',
  standalone: true,
  imports: [CommonModule, FormsModule],  // ✅ Add FormsModule for ngModel
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
    { date: '2025-11-20', amount: 100, bankId: 'B1', brandId: 'BR-1', typeId: 'INCOME', notes: 'Payment received' },
    { date: '2025-11-21', amount: -50, bankId: 'B2', brandId: 'BR-2', typeId: 'EXPENSE', notes: 'Office supplies' }
  ];

  constructor() {}

  ngOnInit(): void {}

  addTransaction() {
    this.transactions.push({ date: '', amount: null, bankId: undefined, brandId: undefined, typeId: undefined, notes: '' });
  }

  removeTransaction(index: number) {
    this.transactions.splice(index, 1);
  }

  saveChanges() {
    alert('Mock save, not wired yet');
  }
}
