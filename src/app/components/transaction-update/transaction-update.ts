import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TransactionGroupService} from '../../services/transaction-group.service';
import {BrandService} from '../../services/brand.service';
import {BankService} from '../../services/bank.service';
import {BrandDto} from '../../dto/brand.dto';
import {TransactionTypeEnum} from '../../dto/transaction-type.enum';
import {BankDto} from '../../dto/bank.dto';
import {TransactionGroupDto, TransactionResponseDto} from '../../dto/transaction-group.dto';
import {TransactionTypeOption} from '../../dto/transaction-type.dto';
import {enumToOptions} from '../../utils/enum-utils';

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
  transactions: TransactionResponseDto[] = [];

  // ---------- LOOKUP DROPDOWNS ----------
  banks: BankDto[] = [];
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
              posted: tx.posted ?? false
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
    this.transactions.push({
      id: '',
      date: '',
      amount: 0,
      notes: '',
      bankId: '',
      brandId: '',
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
      window.alert('Please fill in all required fields (date, type, brand, amount, bank) before marking as posted.');
      return;
    }

    tx.posted = true;
  }

  // -------------------------------
  // Bottom-level actions
  // -------------------------------
  submitAll() {
    if (!this.groupId) {
      window.alert('Group ID not found, cannot submit.');
      return;
    }

    const payload: TransactionGroupDto = {
      id: this.groupId!,  // already included
      transactions: this.transactions
    };

    this.transactionGroupService.updateTransactionGroup(payload)
      .subscribe({
        next: (res) => {
          if (res.success) {
            window.alert('Transaction group updated successfully!');
            this.router.navigate(['/transaction-pending-list']);
          } else {
            window.alert('Failed to update transaction group: ' + res.message);
          }
        },
        error: (err) => {
          console.error('Error updating transaction group:', err);
          window.alert('An error occurred while submitting the transaction group.');
        }
      });
  }

  cancel() {
    if (window.confirm('Discard all changes?')) {
      window.location.reload();
    }
  }

  goBack() {
    this.router.navigate(['/transaction-pending-list']);
  }

  validateTransaction(tx: TransactionResponseDto): boolean {
    return !!tx.date &&
      !!tx.typeId &&
      !!tx.brandId &&
      tx.amount !== null && tx.amount !== undefined &&
      !!tx.bankId;
  }
}
