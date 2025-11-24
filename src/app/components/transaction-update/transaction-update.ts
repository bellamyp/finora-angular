import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Dummy DTOs for mock
interface BankOption { id: string; name: string; }
interface TransactionTypeOption { id: string; name: string; }
interface TransactionRow { amount: number | null; bankId?: string; notes: string; }

@Component({
  selector: 'app-transaction-update',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transaction-update.html',
  styleUrls: ['./transaction-update.scss'],
})
export class TransactionUpdate implements OnInit {

  // Mock group info
  groupId = 'GRP-001';
  groupDate = '2025-11-23';
  selectedBrandId = 'BR-123';
  typeId = 'INCOME';

  // Mock dropdowns
  banks: BankOption[] = [
    { id: 'B1', name: 'Bank A' },
    { id: 'B2', name: 'Bank B' },
  ];
  transactionTypes: TransactionTypeOption[] = [
    { id: 'INCOME', name: 'Income' },
    { id: 'EXPENSE', name: 'Expense' },
  ];
  brands = [
    { id: 'BR-123', name: 'Brand One', location: 'NY' },
    { id: 'BR-456', name: 'Brand Two', location: 'CA' },
  ];

  // Mock transactions
  transactions: TransactionRow[] = [
    { amount: 100, bankId: 'B1', notes: 'First transaction' },
    { amount: -50, bankId: 'B2', notes: 'Second transaction' },
  ];

  constructor() {}

  ngOnInit(): void {
    // Here you could load actual transaction data from BE later
  }

  addTransaction() {
    this.transactions.push({ amount: null, bankId: undefined, notes: '' });
  }

  removeTransaction(index: number) {
    this.transactions.splice(index, 1);
  }

  saveChanges() {
    window.alert('Save function not implemented yet (mock)');
  }
}
