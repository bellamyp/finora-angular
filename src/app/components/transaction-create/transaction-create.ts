import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { BrandDto } from '../../dto/brand.dto';
import {Router} from '@angular/router';
import {TransactionTypeEnum} from '../../dto/transaction-type.enum';
import {BankService} from '../../services/bank.service';
import {TransactionGroupService} from '../../services/transaction-group.service';
import {TransactionGroupCreateDto} from '../../dto/transaction-group-create.dto';

function enumToOptions<T extends Record<string, string>>(enumObj: T): { id: string; name: string }[] {
  return Object.values(enumObj).map(v => ({
    id: v as string,
    name: (v as string).replace(/_/g, ' ')
  }));
}

// Dummy DTOs for example
interface BankOption { id: string; name: string; }
interface TransactionTypeOption { id: string; name: string; }

@Component({
  selector: 'app-transaction-create',
  imports: [CommonModule, FormsModule],
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

  constructor(
    private brandService: BrandService,
    private bankService: BankService,
    private transactionGroupService: TransactionGroupService,
    private router: Router
  ) {}

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

    // Load banks for the current user
    this.bankService.getBanks().subscribe({
      next: (data) => this.banks = data,
      error: (err) => console.error('[Bank] Load Error:', err),
    });

    // Load brands for current user
    this.loadBrands();

    // Load transaction types (from FE enum)
    this.transactionTypes = enumToOptions(TransactionTypeEnum);
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
    if (!this.typeId) {
      alert('Please select a transaction type.');
      return;
    }

    // Use TransactionGroupCreateDto for type safety
    const payload: TransactionGroupCreateDto = {
      date: this.groupDate!,
      brandId: this.selectedBrandId,
      typeId: this.typeId,
      transactions: this.transactions.map(t => ({
        amount: t.amount,
        bankId: t.bankId!,
        notes: t.notes
      }))
    };

    this.transactionGroupService.createTransactionGroup(payload).subscribe({
      next: (res) => {
        if (res.success) {
          alert(`Transaction group created! ID: ${res.groupId}`);
          console.log('Response:', res);

          // Redirect to home page
          this.router.navigate(['/']);
        } else {
          alert(`Failed to create transaction group: ${res.message}`);
        }
      },
      error: (err) => {
        console.error('Failed to create transaction group:', err);
        alert('Failed to create transaction group. Check console for details.');
      }
    });
  }
}
