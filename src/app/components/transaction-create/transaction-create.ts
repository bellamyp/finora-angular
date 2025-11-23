import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { BrandDto } from '../../dto/brand.dto';
import {RouterLink} from '@angular/router';

// Dummy DTOs for example
interface BankOption { id: string; name: string; }
interface TransactionTypeOption { id: string; name: string; }

@Component({
  selector: 'app-transaction-create',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './transaction-create.html',
  styleUrls: ['./transaction-create.scss'],
})
export class TransactionCreate implements OnInit {

  // ---------- GLOBAL GROUP FIELDS ----------
  groupDate?: string;
  selectedBrandId?: string; // only selection allowed
  typeId?: string;

  // ---------- ROW-LEVEL TRANSACTIONS ----------
  transactions = [
    { amount: null as number | null, bankId: undefined as string | undefined, notes: '' }
  ];

  // ---------- LOOKUP DROPDOWNS ----------
  banks: BankOption[] = [];
  transactionTypes: TransactionTypeOption[] = [];
  brands: BrandDto[] = [];

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    // Testing
    console.log(this.brandService.getBrandsByUser());
    this.brandService.getBrandsByUser();

    // Default to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.groupDate = `${yyyy}-${mm}-${dd}`;

    // Load dropdowns
    this.banks = [
      { id: 'bank1', name: 'Bank of America' },
      { id: 'bank2', name: 'Chase Bank' }
    ];

    this.transactionTypes = [
      { id: 'type1', name: 'Expense' },
      { id: 'type2', name: 'Income' }
    ];

    this.loadBrands();
  }

  // ---------------- BRAND ----------------
  loadBrands() {
    this.brandService.getBrandsByUser() // fetch all brands or popular ones
      .subscribe({
        next: (res) => this.brands = res,
        error: (err) => console.error('[Brand] Load Error:', err)
      });
  }

  // ---------------- ROW MANAGEMENT ----------------
  addTransaction() {
    this.transactions.push({ amount: null, bankId: undefined, notes: '' });
  }

  removeTransaction(index: number) {
    this.transactions.splice(index, 1);
  }

  // ---------------- SUBMIT ----------------
  submitGroup() {
    if (!this.selectedBrandId) {
      alert('Please select a brand from the dropdown.');
      return;
    }

    const payload = {
      date: this.groupDate,
      brandId: this.selectedBrandId,
      typeId: this.typeId,
      transactions: this.transactions
    };

    console.log('[Transaction Group Submit]', payload);
    // TODO: send payload to backend
  }
}
