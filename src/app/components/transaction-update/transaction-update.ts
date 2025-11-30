import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionGroupService } from '../../services/transaction-group.service';
import { BrandService } from '../../services/brand.service';
import { BankService } from '../../services/bank.service';
import { BrandDto } from '../../dto/brand.dto';
import { TransactionTypeEnum } from '../../dto/transaction-type.enum';
import { BankDto } from '../../dto/bank.dto';
import { TransactionGroupDto, TransactionResponseDto } from '../../dto/transaction-group.dto';
import { TransactionTypeOption } from '../../dto/transaction-type.dto';
import { enumToOptions } from '../../utils/enum-utils';
import {LocationService} from '../../services/location.service';

type Mode = 'create' | 'update' | 'repeat';

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
  mode: Mode = 'create';
  transactions: TransactionResponseDto[] = [];

  errorMessage: string | null = null;

  // Lookup dropdowns
  banks: BankDto[] = [];
  transactionTypes: TransactionTypeOption[] = [];
  brands: BrandDto[] = [];
  locations: { id: string, name: string }[] = [];

  showCashbackInput: boolean = false;
  cashbackPercent: number | null = null;

  showSplitFirstInput: boolean = false;
  splitFirstCount: number | null = null;

  showSplitAllInput: boolean = false;
  splitAllCount: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionGroupService: TransactionGroupService,
    private bankService: BankService,
    private brandService: BrandService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    // Determine mode
    this.groupId = this.route.snapshot.paramMap.get('groupId') || undefined;
    const isRepeat = this.route.snapshot.url.some(seg => seg.path === 'repeat');

    if (this.groupId && isRepeat) this.mode = 'repeat';
    else if (this.groupId) this.mode = 'update';
    else this.mode = 'create';

    // Load lookup data
    this.loadLookups();

    // Load the existing group if update or repeat
    if (this.mode === 'update' || this.mode === 'repeat') {
      this.transactionGroupService.getTransactionGroupById(this.groupId!)
        .subscribe({
          next: group => {
            this.transactions = group.transactions.map(tx => ({
              ...tx,
              posted: this.mode === 'repeat' ? false : tx.posted ?? false
            }));
            this.loading = false;
          },
          error: err => {
            console.error('Failed to fetch transaction group:', err);
            this.loading = false;
          }
        });
    } else {
      this.addTransaction();
      this.loading = false;
    }
  }

  get pageTitle(): string {
    switch (this.mode) {
      case 'create': return 'Create New Group';
      case 'update': return `Update This Group: ${this.groupId}`;
      case 'repeat': return `Repeat This Group: ${this.groupId}`;
      default: return '';
    }
  }

  loadLookups() {
    this.bankService.getBanks().subscribe({ next: data => this.banks = data });
    this.brandService.getBrandsByUser().subscribe({ next: data => this.brands = data });
    this.transactionTypes = enumToOptions(TransactionTypeEnum);
    // Fetch locations
    this.locationService.getLocations().subscribe({
      next: data => {
        // Map to { id, name } format for the dropdown
        this.locations = data.map(loc => ({
          id: loc.id,
          name: `${loc.city}, ${loc.state}`
        }));
      },
      error: err => console.error('Failed to fetch locations:', err)
    });
  }

  addTransaction() {
    // Default to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    this.transactions.push({
      id: '',
      date: todayStr,
      amount: null,
      notes: '',
      bankId: '',
      brandId: '',
      locationId: '',
      typeId: '',
      posted: false
    });
  }

  addCashbackTransaction(percent: number | null) {
    if (!percent || percent <= 0) {
      window.alert('Enter a valid cashback percentage.');
      return;
    }

    if (this.transactions.length === 0) {
      window.alert('Please add a main transaction first.');
      return;
    }

    const lastTx = this.transactions[this.transactions.length - 1];

    if (!lastTx.amount) {
      window.alert('Please enter the main transaction amount first.');
      return;
    }

    // Opposite sign of the main transaction
    const cashbackAmount = +((Math.abs(lastTx.amount) * percent / 100) * -Math.sign(lastTx.amount)).toFixed(2);
    const date = lastTx.date || new Date().toISOString().slice(0, 10);

    this.transactions.push({
      id: '',
      date: date,
      amount: cashbackAmount,
      notes: `${percent}% cashback`,
      bankId: '',
      brandId: lastTx.brandId,
      locationId: lastTx.locationId,
      typeId: lastTx.typeId,
      posted: false
    });

    // Reset input
    this.showCashbackInput = false;
    this.cashbackPercent = null;
  }

  /** Split the first transaction by the given count */
  splitFirst(count: number | null) {
    if (!count || count < 2) {
      window.alert('Enter a valid split count (2 or more).');
      return;
    }

    if (this.transactions.length === 0) {
      window.alert('No transactions to split.');
      return;
    }

    const firstTx = this.transactions[0];
    if (!firstTx.amount) {
      window.alert('First transaction has no amount.');
      return;
    }

    // Opposite sign of the first transaction
    const splitAmount = +((Math.abs(firstTx.amount) / count) * -Math.sign(firstTx.amount)).toFixed(2);

    const newTxs: TransactionResponseDto[] = [];
    for (let i = 0; i < count; i++) {
      newTxs.push({
        ...firstTx,
        id: '',
        amount: splitAmount,
        notes: firstTx.notes ? `${firstTx.notes} (split)` : 'Split transaction',
        posted: false
      });
    }

    this.transactions.splice(1, 0, ...newTxs);

    this.showSplitFirstInput = false;
    this.splitFirstCount = null;
  }

  /** Split all transactions by the given count */
  splitAll(count: number | null) {
    if (!count || count < 2) {
      window.alert('Enter a valid split count (2 or more).');
      return;
    }

    if (this.transactions.length === 0) {
      window.alert('No transactions to split.');
      return;
    }

    // Total net amount of all transactions
    const totalAmount = this.transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    if (totalAmount === 0) {
      window.alert('Total transaction amount is zero, cannot split.');
      return;
    }

    // Opposite sign of total amount
    const splitAmount = +((Math.abs(totalAmount) / count) * -Math.sign(totalAmount)).toFixed(2);

    // Use first transaction as template
    const templateTx = this.transactions[0];
    const newTxs: TransactionResponseDto[] = [];
    for (let i = 0; i < count; i++) {
      newTxs.push({
        ...templateTx,
        id: '',
        amount: splitAmount,
        notes: 'Split all transactions',
        posted: false
      });
    }

    this.transactions.push(...newTxs);

    this.showSplitAllInput = false;
    this.splitAllCount = null;
  }

  openAddLocation() {
    this.router.navigate(['/location-create']);
  }

  openAddBrand() {
    this.router.navigate(['/brand-create']);
  }

  openAddBank() {
    this.router.navigate(['/bank-create']);
  }

  deleteTransaction(tx: TransactionResponseDto, index: number) {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      this.transactions.splice(index, 1);
    }
  }

  markAsPosted(tx: TransactionResponseDto) {
    const missing = this.getMissingFieldsForPost(tx);

    if (missing.length > 0) {
      window.alert("Please fill in the following fields:\n- " + missing.join("\n- "));
      return;
    }

    tx.posted = true;
  }

  /** Submit all transactions */
  submitAll() {
    // CREATE mode: must have at least 1 transaction, and every transaction must have a bank selected
    if (this.mode === 'create') {
      // Must have at least 1 transaction
      if (this.transactions.length === 0) {
        window.alert('Add at least one transaction.');
        return;
      }

      // Every transaction must have a bank selected
      const invalidTx = this.transactions.find(tx => !tx.bankId);
      if (invalidTx) {
        window.alert('All transactions must have a bank selected.');
        return;
      }
    } else {
      // All other transactions must have a bank selected
      const invalidTx = this.transactions.find(tx => !tx.bankId);
      if (invalidTx) {
        window.alert('All transactions must have a bank selected.');
      }
    }

    const payload: TransactionGroupDto = {
      id: this.mode === 'update' ? this.groupId! : undefined,
      transactions: this.transactions
    };

    const request$ = this.mode === 'update'
      ? this.transactionGroupService.updateTransactionGroup(payload)
      : this.transactionGroupService.createTransactionGroup(payload);

    request$.subscribe({
      next: res => {
        if (res.success) {
          this.router.navigate(['/transaction-view', res.groupId || this.groupId]);
        } else {
          this.errorMessage = res.message;  // show backend message inline
        }
      },
      error: err => {
        console.error('Error submitting transaction group:', err);
        this.errorMessage = "An unexpected error occurred. Please try again.";
      }
    });
  }

  /** Validate transaction for posting (all fields required) */
  /** Return a list of missing fields required for posting */
  getMissingFieldsForPost(tx: TransactionResponseDto): string[] {
    const missing: string[] = [];

    if (!tx.date) missing.push("Date");
    if (!tx.typeId) missing.push("Type");
    if (!tx.brandId) missing.push("Brand");
    if (!tx.locationId) missing.push("Location");
    if (tx.amount === null || tx.amount === undefined) missing.push("Amount");
    if (!tx.bankId) missing.push("Bank");

    return missing;
  }

  cancel() { window.location.reload(); }
  goBack() { this.router.navigate(['/transaction-pending-list']); }
}
