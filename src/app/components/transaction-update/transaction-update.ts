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

  // Lookup dropdowns
  banks: BankDto[] = [];
  transactionTypes: TransactionTypeOption[] = [];
  brands: BrandDto[] = [];
  locations: { id: string, name: string }[] = [];

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
      amount: 0,
      notes: '',
      bankId: '',
      brandId: '',
      locationId: '',
      typeId: '',
      posted: false
    });
  }

  openAddLocation() {
    this.router.navigate(['/location-create']);
  }

  openAddBrand() {
    window.alert('Not implemented yet');
  }

  openAddBank() {
    window.alert('Not implemented yet');
  }

  deleteTransaction(tx: TransactionResponseDto, index: number) {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      this.transactions.splice(index, 1);
    }
  }

  markAsPosted(tx: TransactionResponseDto) {
    if (!this.validateTransactionForPost(tx)) {
      window.alert('Please fill in all required fields (date, type, brand, amount, bank).');
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
          window.alert(res.message);
        }
      },
      error: err => console.error('Error submitting transaction group:', err)
    });
  }

  /** Validate transaction for posting (all fields required) */
  validateTransactionForPost(tx: TransactionResponseDto): boolean {
    return !!tx.date &&
      !!tx.typeId &&
      !!tx.brandId &&
      !!tx.locationId &&
      tx.amount !== null && tx.amount !== undefined &&
      !!tx.bankId;
  }

  cancel() { window.location.reload(); }
  goBack() { this.router.navigate(['/transaction-pending-list']); }
}
