import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TransactionGroupService} from '../../services/transaction-group.service';
import {BrandService} from '../../services/brand.service';
import {BankService} from '../../services/bank.service';
import {BrandDto} from '../../dto/brand.dto';
import {TransactionTypeEnum} from '../../dto/transaction-type.enum';

function enumToOptions<T extends Record<string, string>>(enumObj: T): { id: string; name: string }[] {
  return Object.values(enumObj).map(v => ({
    id: v as string,
    name: (v as string).replace(/_/g, ' ')
  }));
}

interface BankOption { id: string; name: string; }
interface TransactionTypeOption { id: string; name: string; }
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

  loading: boolean = true;
  groupId?: string;
  transactions: TransactionRow[] = [];

  // ---------- LOOKUP DROPDOWNS ----------
  banks: BankOption[] = [];
  transactionTypes: TransactionTypeOption[] = [];
  brands: BrandDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionGroupService: TransactionGroupService,
    private bankService: BankService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get('groupId') || '';
    console.log('Transaction Update initialized with groupId:', this.groupId);

    if (this.groupId) {
      this.transactionGroupService.getTransactionGroupById(this.groupId)
        .subscribe({
          next: (group) => {
            console.log('Fetched transaction group from BE:', group);

            this.transactions = group.transactions.map(tx => ({
              ...tx,
              posted: false
            }));

            this.loading = false;   // <-- STOP LOADING
          },
          error: (err) => {
            console.error('Failed to fetch transaction group:', err);
            this.loading = false;   // <-- ENSURE STOP LOADING ON ERROR
          }
        });
    } else {
      console.warn('No groupId provided in route!');
      this.loading = false;
    }

    // Load banks
    this.bankService.getBanks().subscribe({
      next: (data) => this.banks = data,
      error: (err) => console.error('[Bank] Load Error:', err),
    });

    // Load brands
    this.brandService.getBrandsByUser().subscribe({
      next: (data) => this.brands = data,
      error: (err) => console.error('[Brand] Load Error:', err)
    });

    // Load types
    this.transactionTypes = enumToOptions(TransactionTypeEnum);
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
    this.router.navigate(['/transaction-pending-list']);
  }
}
