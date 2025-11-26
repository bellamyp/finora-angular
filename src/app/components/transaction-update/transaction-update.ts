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
import { NgSelectModule } from '@ng-select/ng-select';

type Mode = 'create' | 'update' | 'repeat';

@Component({
  selector: 'app-transaction-update',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
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
    private brandService: BrandService
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
  }

  addTransaction() {
    this.transactions.push({
      id: '',
      date: '',
      amount: 0,
      notes: '',
      bankId: '',
      brandId: '',
      brandName: '',      // for ng-select new entry
      locationId: '',
      locationName: '',   // for ng-select new entry
      typeId: '',
      posted: false
    });
  }

  deleteTransaction(tx: TransactionResponseDto, index: number) {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      this.transactions.splice(index, 1);
    }
  }

  markAsPosted(tx: TransactionResponseDto) {
    if (!this.validateTransaction(tx)) {
      window.alert('Please fill in all required fields (date, type, brand, amount, bank).');
      return;
    }
    tx.posted = true;
  }

  submitAll() {
    if (!this.transactions.length) {
      window.alert('Add at least one transaction.');
      return;
    }

    const payload: TransactionGroupDto = {
      id: this.mode === 'update' ? this.groupId! : undefined,
      transactions: this.transactions.map(tx => ({
        ...tx,
        // Send typed brand/location name if no ID
        brandName: tx.brandId ? undefined : tx.brandName,
        locationName: tx.locationId ? undefined : tx.locationName
      }))
    };

    if (this.mode === 'create' || this.mode === 'repeat') {
      // POST
      this.transactionGroupService.createTransactionGroup(payload).subscribe({
        next: res => {
          if (res.success) this.router.navigate(['/transaction-view', res.groupId]);
          else window.alert(res.message);
        },
        error: err => console.error('Error creating transaction group:', err)
      });
    } else if (this.mode === 'update') {
      // PUT
      this.transactionGroupService.updateTransactionGroup(payload).subscribe({
        next: res => {
          if (res.success) this.router.navigate(['/transaction-view', this.groupId]);
          else window.alert(res.message);
        },
        error: err => console.error('Error updating transaction group:', err)
      });
    }
  }

  cancel() {
    window.location.reload();
  }

  cancel() { window.location.reload(); }
  goBack() { this.router.navigate(['/transaction-pending-list']); }

  validateTransaction(tx: TransactionResponseDto): boolean {
    return !!tx.date &&
      !!tx.typeId &&
      (!!tx.brandId || !!tx.brandName) &&
      (!!tx.locationId || !!tx.locationName) &&
      tx.amount !== null && tx.amount !== undefined &&
      !!tx.bankId;
  }
}
